// DocumentsCard.js
'use client';
import React, { useState } from 'react';

const DocumentsCard = ({ documents: initialDocs, editable = false }) => {
  const [documents, setDocuments] = useState(initialDocs);

  const removeDocument = (name) => {
    setDocuments(documents.filter(doc => doc.name !== name));
  };

  const uploadDocument = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments([...documents, { name: file.name, meta: 'Just uploaded' }]);
    }
  };

  return (
    <div className="bg-blue-100 p-6 rounded-xl flex flex-col gap-4">
      <h3 className="text-xl font-bold">Documents</h3>
      {documents.map((doc, idx) => (
        <div key={idx} className="flex justify-between items-center bg-blue-600 text-white p-2 rounded">
          <span>{doc.name}</span>
          {editable && <button onClick={() => removeDocument(doc.name)}>Remove</button>}
        </div>
      ))}
      {editable && (
        <input type="file" onChange={uploadDocument} className="mt-2"/>
      )}
    </div>
  );
};

export default DocumentsCard;
