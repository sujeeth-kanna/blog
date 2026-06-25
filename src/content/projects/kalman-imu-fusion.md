---
title: "Sensor Fusion on an STM32: A Kalman Filter Post-Mortem"
description: "Fusing accelerometer and gyroscope data in fixed time, on a Cortex-M4 with no FPU headroom to spare."
date: 2026-05-18
tags: ["embedded", "dsp", "stm32", "kalman"]
draft: false
---

This is a sample post. It exists to demonstrate that **math**, **code blocks**,
and **captioned images** all render correctly. Delete it once you've read it.

## The problem

I needed a stable attitude estimate from a cheap 6-axis IMU. The accelerometer
is noisy but unbiased; the gyroscope is smooth but drifts. The standard fix is a
linear Kalman filter.

## The math

The state evolves as a linear system with process noise $w_k$:

$$
\mathbf{x}_{k} = \mathbf{F}\,\mathbf{x}_{k-1} + \mathbf{B}\,\mathbf{u}_{k} + w_k
$$

The two core update steps are the prediction of the error covariance,

$$
\mathbf{P}_k^{-} = \mathbf{F}\,\mathbf{P}_{k-1}\,\mathbf{F}^{\mathsf{T}} + \mathbf{Q},
$$

and the Kalman gain that weights measurement against prediction,

$$
\mathbf{K}_k = \mathbf{P}_k^{-}\mathbf{H}^{\mathsf{T}}
\left( \mathbf{H}\,\mathbf{P}_k^{-}\mathbf{H}^{\mathsf{T}} + \mathbf{R} \right)^{-1}.
$$

Inline math works too: the gain $\mathbf{K}_k \in [0, 1]$ for the scalar case.

## The code

The prediction step, written for fixed-point friendliness on a Cortex-M4:

```c
/* One predict/update cycle. State is [angle, bias]. */
void kalman_step(KalmanState *s, float gyro_rate, float accel_angle, float dt) {
    /* --- Predict --- */
    s->angle += dt * (gyro_rate - s->bias);

    s->P[0][0] += dt * (dt * s->P[1][1] - s->P[0][1] - s->P[1][0] + s->Q_angle);
    s->P[0][1] -= dt * s->P[1][1];
    s->P[1][0] -= dt * s->P[1][1];
    s->P[1][1] += s->Q_bias * dt;

    /* --- Update --- */
    float y = accel_angle - s->angle;          /* innovation */
    float S = s->P[0][0] + s->R_measure;        /* innovation covariance */
    float K0 = s->P[0][0] / S;                  /* Kalman gain */
    float K1 = s->P[1][0] / S;

    s->angle += K0 * y;
    s->bias  += K1 * y;

    float P00 = s->P[0][0], P01 = s->P[0][1];
    s->P[0][0] -= K0 * P00;
    s->P[0][1] -= K0 * P01;
    s->P[1][0] -= K1 * P00;
    s->P[1][1] -= K1 * P01;
}
```

A quick verification harness in Python:

```python
import numpy as np

def simulate(true_angle, gyro_bias=0.02, noise=0.5, n=500, dt=0.01):
    gyro = np.gradient(true_angle, dt) + gyro_bias
    accel = true_angle + np.random.normal(0, noise, n)
    return gyro, accel
```

And the device-tree-ish config snippet that wired it up:

```ini
[imu]
sample_rate_hz = 100
q_angle       = 0.001
q_bias        = 0.003
r_measure     = 0.030
```

## Embedding a figure

You can drop a captioned image with a plain HTML `<figure>` block right inside
Markdown — no special syntax, no layout breakage:

<figure>
  <img src="/images/sample-schematic.png" alt="IMU breakout wiring diagram" />
  <figcaption>Figure 1. Breakout wiring: SDA/SCL pulled up to 3V3, INT on PB0.</figcaption>
</figure>

Put image files in <code>public/images/</code> and reference them as
<code>/images/your-file.png</code>.

## What I'd change

The fixed `R_measure` is a lie — accelerometer trust should drop under linear
acceleration. Next iteration gates it on $\lVert \mathbf{a} \rVert \approx g$.
