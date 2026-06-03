'use client';

import { AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import { useCallback, useState } from 'react';

interface PaymentProof {
  file: File;
  preview: string;
}

interface PaymentProofUploaderProps {
  appointmentId?: string;
  expectedAmount: number;
}

export function PaymentProofUploader({ appointmentId, expectedAmount }: PaymentProofUploaderProps) {
  const [paymentProof, setPaymentProof] = useState<PaymentProof | null>(null);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [idempotencyKey] = useState(() => `payment_${appointmentId}_${Date.now()}`);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Only PNG, JPG, and PDF files accepted');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPaymentProof({
        file,
        preview: event.target?.result as string,
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!paymentProof || !appointmentId) {
      setError('Please select a file');
      return;
    }

    // Prevent double submission
    if (requestInProgress || uploading || verifying) {
      console.warn('Request already in progress');
      return;
    }

    setUploading(true);
    setError(null);
    setRequestInProgress(true);

    try {
      const formData = new FormData();
      formData.append('file', paymentProof.file);
      formData.append('appointmentId', appointmentId);
      formData.append('expectedAmount', expectedAmount.toString());

      // Create abort controller with 30 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/appointments/verify-payment', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          // Add idempotency key for backend deduplication
          'X-Idempotency-Key': idempotencyKey,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json();

        if (response.status === 408) {
          throw new Error('Request timed out. Please try again.');
        }

        if (response.status === 409) {
          // Payment already verified (idempotency)
          setVerified(true);
          setError(null);
          return;
        }

        throw new Error(data.message || 'Verification failed');
      }

      const data = await response.json();
      setVerified(true);
      setError(null);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request took too long. Please check your connection and try again.');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
    } finally {
      setUploading(false);
      setVerifying(false);
      setRequestInProgress(false);
    }
  }, [paymentProof, appointmentId, expectedAmount, requestInProgress, uploading, verifying, idempotencyKey]);

  const isSubmitDisabled = !paymentProof || uploading || verifying || verified || requestInProgress;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
        <h3 className="font-display text-lg font-bold text-nyaay-navy mb-4">Upload UPI Payment Receipt</h3>

        {/* Payment Instructions */}
        <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-200 p-4 text-sm">
          <p className="font-semibold text-blue-900 mb-2">💳 Payment Instructions</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-xs">
            <li>Open your banking app (PhonePe, Google Pay, Paytm, BHIM)</li>
            <li>Enter UPI ID or scan QR code</li>
            <li>Send ₹{expectedAmount} to the advocate</li>
            <li>Take a screenshot of the success confirmation</li>
            <li>Upload screenshot below</li>
          </ol>
        </div>

        {/* File Upload */}
        {!verified && (
          <>
            {!paymentProof ? (
              <label className="block cursor-pointer">
                <div className="rounded-2xl border-2 border-dashed border-nyaay-border bg-nyaay-surface p-6 text-center hover:border-nyaay-saffron transition">
                  <p className="text-sm font-semibold text-nyaay-navy">
                    📸 Upload Payment Screenshot
                  </p>
                  <p className="text-xs text-nyaay-muted mt-1">
                    PNG, JPG, or PDF (max 10 MB)
                  </p>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleFileSelect}
                    className="sr-only"
                    aria-label="Payment proof file input"
                    disabled={requestInProgress}
                  />
                </div>
              </label>
            ) : (
              <div className="space-y-3">
                <div className="rounded-2xl border border-nyaay-border p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      {paymentProof.file.type.startsWith('image') ? (
                        <img src={paymentProof.preview} alt="Preview" className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        <span className="text-xs font-bold">PDF</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-nyaay-navy">{paymentProof.file.name}</p>
                      <p className="text-xs text-nyaay-muted">{(paymentProof.file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPaymentProof(null);
                      setError(null);
                    }}
                    disabled={requestInProgress}
                    className="p-2 text-nyaay-muted hover:text-red-600 transition"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleUpload}
                  disabled={isSubmitDisabled}
                  className="w-full h-12 rounded-2xl bg-nyaay-saffron text-white font-bold disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  aria-busy={uploading || verifying}
                  aria-label={verifying ? 'Verifying payment' : 'Verify payment'}
                >
                  {uploading || verifying ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      {uploading ? 'Uploading...' : 'Verifying...'}
                    </>
                  ) : (
                    'Verify Payment'
                  )}
                </button>

                {/* Timeout Warning */}
                {requestInProgress && (
                  <p className="text-xs text-nyaay-muted text-center">
                    ⏱️ This may take up to 30 seconds...
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Verified State */}
        {verified && (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-900">✓ Payment Verified!</p>
            <p className="text-sm text-green-800 mt-1">
              Your consultation is confirmed. Check your email for appointment details.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-sm">{error}</p>
              {error.includes('not found') && (
                <p className="text-xs text-red-800 mt-1">
                  Please ensure you sent ₹{expectedAmount} to the correct UPI ID.
                </p>
              )}
              {error.includes('timed out') && (
                <button
                  onClick={handleUpload}
                  disabled={isSubmitDisabled}
                  className="text-xs text-red-700 font-semibold hover:underline mt-2"
                >
                  Retry verification →
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      {!verified && (
        <div className="rounded-2xl bg-nyaay-surface p-4 text-xs text-nyaay-muted">
          <p className="font-semibold text-nyaay-navy mb-2">💡 Troubleshooting</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Screenshot must show the transaction success confirmation</li>
            <li>Ensure the UPI amount matches ₹{expectedAmount}</li>
            <li>Transaction ID or reference number should be visible</li>
            <li>Contact support if verification fails twice</li>
          </ul>
        </div>
      )}
    </div>
  );
}
