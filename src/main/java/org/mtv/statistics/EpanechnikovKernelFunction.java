package org.mtv.statistics;

public class EpanechnikovKernelFunction extends KernelFunction {
    @Override
    public double compute(double x) {
        return Math.max(
                0.0,
                3.0 / 4.0 *
                    (1.0 - (1.0 / 5.0 * Math.pow(x, 2.0)))
                        / Math.sqrt(5)
        );
    }
}
