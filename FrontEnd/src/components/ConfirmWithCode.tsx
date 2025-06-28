import { useState } from 'react';
import axios from 'axios';

interface Props {
  actionLabel: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ConfirmWithCode: React.FC<Props> = ({ actionLabel, onSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (code.trim().length !== 4 || !/^\d{4}$/.test(code)) {
      setError('Code must be 4 digits.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post('/HeroTasks/verify-code', { code }, { withCredentials: true });

      if (response.status === 200) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Code verification failed:", error);
      setError('Invalid code for this account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirm-code-wrapper">
      <p>{actionLabel}</p>
      <input
        type="text"
        value={code}
        maxLength={4}
        placeholder="Enter your 4-digit code"
        onChange={(e) => setCode(e.target.value)}
      />
      {error && <p className="error-msg">{error}</p>}

      <div className="confirm-code-actions">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Validating...' : 'Confirm'}
        </button>
      </div>

    </div>
  );
};

export default ConfirmWithCode;