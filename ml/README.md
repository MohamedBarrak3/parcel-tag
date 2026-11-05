# ML model (Edge Impulse)

- Tool: Edge Impulse. Impulse: time series, 2000 ms window, 500 ms increase, 100 Hz, Spectral Analysis + Classification (neural network, 30 training cycles, learning rate 0.0005, auto-weight classes).
- Data: 107 training samples and 31 test samples (78/22 split). Training data per class: carried ≈240 s, drop ≈115 s, impact ≈145 s, upside_down ≈40 s.
- Test set: Edge Impulse's 78/22 split of our collection; a separate session will be recorded as a held-out test set.
- Test results, quantized int8 model (the one deployed): overall accuracy 78.61%, ROC AUC 0.96, weighted F1 0.82. Per class: carried 93.7% (F1 0.97), drop 66.7% (F1 0.55), impact 51.0% (F1 0.61), upside_down 83.3% (F1 0.77).
- Main confusion: drop vs impact (22% of drops predicted as impact, 39% of impacts as drop). Possible fix: merge them into one "mishandling" class, since the firmware gets drop height from free fall anyway.
- Edge Impulse estimate on ESP32 240 MHz (int8, EON): latency 87 ms (86 ms spectral features + 1 ms classifier), RAM 5.6 KB, classifier flash 15.9 KB (no estimate given for the spectral features). Real inference time on the tag to be measured by Sarah.
- float32 gives the same accuracy (78.61%) but 89 ms and 17.7 KB classifier flash, so int8 was chosen.
- Figures: docs/confusion_matrix_test.png and docs/accuracy_per_class.png
- Deployment: Arduino library, quantized int8, EON Compiler, zip in ml/.

## Baseline vs model

Rule-based baseline (`ml/baseline.py`) on the same 31 test samples, cut into 2 s windows with a 0.5 s step.

| Class | Rules (baseline) | Edge Impulse model (int8) |
|---|---|---|
| carried | 100% | 93.7% |
| drop | 100% | 66.7% |
| impact | 58.8% | 51.0% |
| upside_down | 100% | 83.3% |
| Overall (windows) | 89.6% | 78.6% |
| Mean of 4 classes | 89.7% | 73.7% |

1. Both confuse impact with drop: 21/51 impact windows contain ≥8 samples below 4.9 m/s² before the spike, so the impact recordings likely include a short free fall.
2. The free-fall rule is a strong physical signal for drops, while the model has little drop data.
3. Not a strictly equal comparison: window cutting differs, Edge Impulse counts "uncertain" as wrong, and carried dominates the window counts.
4. Thresholds come from the task card and were not tuned on this data.

Setup (once, from the repo root):
1. Create the venv: `python -m venv ml\venv`
2. Install numpy: `ml\venv\Scripts\python.exe -m pip install numpy`
3. Export the data from Edge Impulse (Data acquisition → Export data) and unzip it into `ml\ei_export\` (git-ignored), keeping `info.labels`.

Run: `ml\venv\Scripts\python.exe ml\baseline.py` (add `--all` for train+test).
