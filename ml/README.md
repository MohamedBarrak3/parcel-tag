# ML model (Edge Impulse)

- Tool: Edge Impulse. Impulse: time series, 2000 ms window, 500 ms increase, 100 Hz, Spectral Analysis + Classification (neural network, 30 training cycles, learning rate 0.0005, auto-weight classes).
- Data: 107 training samples and 31 test samples (78/22 split). Training data per class: carried ≈240 s, drop ≈115 s, impact ≈145 s, upside_down ≈40 s.
- Test set: Edge Impulse's 78/22 split of our collection; a separate session will be recorded as a held-out test set.
- Test results, quantized int8 model (the one deployed): overall accuracy 78.61%, ROC AUC 0.96, weighted F1 0.82. Per class: carried 93.7% (F1 0.97), drop 66.7% (F1 0.55), impact 51.0% (F1 0.61), upside_down 83.3% (F1 0.77).
- Main confusion: drop vs impact (22% of drops predicted as impact, 39% of impacts as drop). Possible fix: merge them into one "mishandling" class, since the firmware gets drop height from free fall anyway.
- Edge Impulse estimate on ESP32 240 MHz (int8, EON): latency 87 ms (86 ms spectral features + 1 ms classifier), RAM 5.6 KB, flash 15.9 KB (classifier only; Edge Impulse gives no flash estimate for the spectral features block, so the total is not known).
- float32 gives the same accuracy (78.61%) but 89 ms and 17.7 KB classifier flash, so int8 was chosen. Real inference time on the tag to be measured by Sarah.
- Figures: docs/confusion_matrix_test.png and docs/accuracy_per_class.png
- Deployment: Arduino library, quantized int8, EON Compiler, zip in ml/.
