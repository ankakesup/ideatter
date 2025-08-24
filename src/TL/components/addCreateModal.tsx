import React, { useEffect } from 'react';
import './addCreateModal.css';

// Props型定義
interface AddCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIdeaId: number | null;
  onConfirm?: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const AddCreateModal: React.FC<AddCreateModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedIdeaId, 
  onConfirm 
}) => {
  // モーダルが開いている間、背景のスクロールを無効にする
  useEffect(() => {
    if (isOpen) {
      // モーダルが開いたときにスクロールを無効化
      document.body.style.overflow = 'hidden';
    } else {
      // モーダルが閉じたときにスクロールを有効化
      document.body.style.overflow = 'unset';
    }

    // クリーンアップ関数で確実にスクロールを戻す
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  const addCreate = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/post/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ideaId: id,
          username: "user"
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create error:', errorText);
        return;
      }
      
      console.log('Create request successful');
    } catch (err) {
      console.error('Create request failed:', err);
    }
  };

  const handleConfirm = async () => {
    if (selectedIdeaId !== null) {
      await addCreate(selectedIdeaId);
      if (onConfirm) {
        onConfirm();
      }
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // モーダルの背景をクリックした場合のみ閉じる
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // モーダルが開いていない場合は何も表示しない
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>作成確認</h3>
          <button className="close-button" onClick={onClose} aria-label="閉じる">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>このアイデアを作成しますか？</p>
        </div>
        <div className="modal-footer">
          <button className="confirm-button" onClick={handleConfirm}>
            はい
          </button>
          <button className="cancel-button" onClick={onClose}>
            いいえ
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCreateModal;