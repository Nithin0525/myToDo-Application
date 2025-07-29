import React from 'react';

const ExportImport = ({ todos, onImport }) => {
  const exportTodos = () => {
    const data = {
      todos: todos,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importTodos = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.todos && Array.isArray(data.todos)) {
            onImport(data.todos);
          }
        } catch (error) {
          alert('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">📤 Export/Import</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <button 
              className="btn btn-outline-success w-100"
              onClick={exportTodos}
            >
              📤 Export Todos
            </button>
          </div>
          <div className="col-md-6">
            <label className="btn btn-outline-info w-100 mb-0">
              📥 Import Todos
              <input
                type="file"
                accept=".json"
                onChange={importTodos}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportImport; 