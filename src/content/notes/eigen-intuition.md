---
title: "Eigenvectors as the axes a matrix doesn't rotate"
description: "A short note on the geometric reading of the eigenvalue equation."
date: 2026-06-02
tags: ["linear-algebra", "intuition"]
draft: false
---

A short garden note. The defining equation

$$
\mathbf{A}\,\mathbf{v} = \lambda\,\mathbf{v}
$$

says: there exist directions $\mathbf{v}$ that $\mathbf{A}$ only *scales*, never
rotates. The scale factor is $\lambda$.

For a symmetric $\mathbf{A} = \mathbf{A}^{\mathsf{T}}$, those directions are
orthogonal, which is why the spectral theorem lets us write

$$
\mathbf{A} = \mathbf{Q}\,\boldsymbol{\Lambda}\,\mathbf{Q}^{\mathsf{T}},
\qquad \mathbf{Q}^{\mathsf{T}}\mathbf{Q} = \mathbf{I}.
$$

A two-line sanity check:

```python
import numpy as np
A = np.array([[2., 1.], [1., 2.]])
w, V = np.linalg.eigh(A)
assert np.allclose(A @ V, V @ np.diag(w))   # A v = λ v, column-wise
```

Mental model I keep: PCA is just choosing the eigenvectors of the covariance
matrix with the largest $\lambda$ — the axes along which the data stretches most.
