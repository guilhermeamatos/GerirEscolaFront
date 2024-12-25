import React, { useState } from 'react';
import '../styles/UploadFileForm.css'; // Certifique-se de importar o arquivo CSS correto

const UploadFileForm = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecione um arquivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teachers/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao fazer o upload do arquivo.');
      }

      setSuccess('Upload realizado com sucesso!');
      setFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="upload-file-form">
      <h3>Upload de Planilha</h3>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
          className="upload-input"
        />
        <button type="submit" className="button">
          Enviar Planilha
        </button>
      </form>
    </div>
  );
};

export default UploadFileForm;
