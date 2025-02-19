CREATE TABLE users (
    id serial PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE user_roles (
    id serial PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE role_groups (
    id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE role_group_roles (
    id serial PRIMARY KEY,
    role_group_id INT REFERENCES role_groups(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE role_dependencies (
    id serial PRIMARY KEY,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    dependent_role_id INT REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE workflows (
    id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (  -- Previously "nodes"
    id serial PRIMARY KEY,
    workflow_id INT REFERENCES workflows(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    position_x INT NOT NULL,
    position_y INT NOT NULL,
    data JSONB
);

CREATE TABLE edges (
    id serial PRIMARY KEY,
    workflow_id INT REFERENCES workflows(id) ON DELETE CASCADE,
    source_activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    target_activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    label VARCHAR(100)
);

CREATE TABLE workflow_instances (
    id serial PRIMARY KEY,
    workflow_id INT REFERENCES workflows(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    created_by INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflow_instance_actions (
    id serial PRIMARY KEY,
    instance_id UUID REFERENCES workflow_instances(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- e.g., approve, reject
    performed_by int REFERENCES users(id) ON DELETE CASCADE,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE approvals (
    id serial PRIMARY KEY,
    instance_id INT REFERENCES workflow_instances(id) ON DELETE CASCADE,
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    approver_id INT REFERENCES users(id) ON DELETE CASCADE,
    decision VARCHAR(50) NOT NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests (
    id serial PRIMARY KEY,
    instance_id INT REFERENCES workflow_instances(id) ON DELETE CASCADE,
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    requester_id INT REFERENCES users(id) ON DELETE CASCADE,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reworks (
    id serial PRIMARY KEY,
    instance_id INT REFERENCES workflow_instances(id) ON DELETE CASCADE,
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    reason TEXT,
    created_by INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE activities (  -- Previously "nodes"
    id serial PRIMARY KEY,
    workflow_id INT REFERENCES workflows(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    position_x INT NOT NULL,
    position_y INT NOT NULL,
    data JSONB
);

CREATE TABLE workflow_states (
    id serial PRIMARY KEY,
    workflow_id INT REFERENCES workflows(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE role_activity_permissions (
    id serial PRIMARY KEY,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    permission VARCHAR(50) NOT NULL CHECK (permission IN ('view', 'execute', 'approve'))
);

CREATE TABLE role_state_permissions (
    id serial PRIMARY KEY,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    workflow_state_id INT REFERENCES workflow_states(id) ON DELETE CASCADE,
    permission VARCHAR(50) NOT NULL CHECK (permission IN ('transition', 'approve'))
);


CREATE TABLE workflow_history (
    id serial PRIMARY KEY,
    workflow_instance_id INT REFERENCES workflow_instances(id) ON DELETE CASCADE,
    previous_state INT REFERENCES workflow_states(id) ON DELETE SET NULL,
    new_state INT REFERENCES workflow_states(id) ON DELETE SET NULL,
    changed_by INT REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE forms (
    id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    schema JSONB NOT NULL,
    workflow_id int REFERENCES workflows(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE form_instances (
    id SERIAL PRIMARY KEY,
    form_id INT REFERENCES forms(id) ON DELETE CASCADE,
    workflow_instance_id INT REFERENCES workflow_instances(id) ON DELETE CASCADE,
    submitted_by INT REFERENCES users(id) ON DELETE CASCADE,
    data JSONB NOT NULL, -- Stores form submission values
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_workflows_created_by ON workflows(created_by);
CREATE INDEX idx_activities_workflow_id ON activities(workflow_id);
CREATE INDEX idx_edges_workflow_id ON edges(workflow_id);
CREATE INDEX idx_workflow_instances_workflow_id ON workflow_instances(workflow_id);
CREATE INDEX idx_approvals_instance_id ON approvals(instance_id);
CREATE INDEX idx_requests_instance_id ON requests(instance_id);
CREATE INDEX idx_reworks_instance_id ON reworks(instance_id);


CREATE INDEX idx_forms_workflow_id ON forms(workflow_id);
CREATE INDEX `idx_form_instances_form_id` ON form_instances(form_id);
CREATE INDEX idx_form_instances_workflow_instance_id ON form_instances(workflow_instance_id);
```