import React from 'react';

const TodoTemplates = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: 1,
      name: 'Daily Routine',
      description: 'Common daily tasks',
      todos: [
        { title: 'Morning Exercise', description: '30 minutes workout' },
        { title: 'Check Emails', description: 'Review and respond to important emails' },
        { title: 'Plan Tomorrow', description: 'Review and plan for next day' }
      ]
    },
    {
      id: 2,
      name: 'Project Planning',
      description: 'Basic project structure',
      todos: [
        { title: 'Define Requirements', description: 'List all project requirements' },
        { title: 'Create Timeline', description: 'Set project milestones and deadlines' },
        { title: 'Assign Tasks', description: 'Distribute work among team members' }
      ]
    },
    {
      id: 3,
      name: 'Shopping List',
      description: 'Grocery and essentials',
      todos: [
        { title: 'Fruits & Vegetables', description: 'Fresh produce for the week' },
        { title: 'Household Items', description: 'Cleaning supplies and essentials' },
        { title: 'Personal Care', description: 'Hygiene and personal care items' }
      ]
    }
  ];

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">📋 Quick Templates</h5>
      </div>
      <div className="card-body">
        <div className="row">
          {templates.map(template => (
            <div key={template.id} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">{template.name}</h6>
                  <p className="card-text text-muted small">{template.description}</p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onSelectTemplate(template.todos)}
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoTemplates; 