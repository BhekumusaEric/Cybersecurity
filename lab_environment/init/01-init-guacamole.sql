--
-- PostgreSQL initialization script for Guacamole
--

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--
-- Table of connection groups. Each connection group has a name.
--

CREATE TABLE guacamole_connection_group (

  connection_group_id   serial       NOT NULL,
  parent_id             integer,
  connection_group_name varchar(128) NOT NULL,
  type                  varchar(32)  NOT NULL,
  max_connections       integer,
  max_connections_per_user integer,
  enable_session_affinity boolean NOT NULL DEFAULT FALSE,

  PRIMARY KEY (connection_group_id),

  CONSTRAINT connection_group_name_parent
    UNIQUE (connection_group_name, parent_id),

  CONSTRAINT guacamole_connection_group_parent_fkey
    FOREIGN KEY (parent_id)
    REFERENCES guacamole_connection_group (connection_group_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_connection_group(parent_id);

--
-- Table of connections. Each connection has a name, protocol, and
-- associated set of parameters.
-- A connection may belong to a connection group.
--

CREATE TABLE guacamole_connection (

  connection_id       serial       NOT NULL,
  connection_name     varchar(128) NOT NULL,
  parent_id           integer,
  protocol            varchar(32)  NOT NULL,
  
  proxy_port              integer,
  proxy_hostname          varchar(512),
  proxy_encryption_method varchar(4),
  
  max_connections          integer,
  max_connections_per_user integer,
  connection_weight        integer,
  failover_only            boolean NOT NULL DEFAULT FALSE,

  PRIMARY KEY (connection_id),

  CONSTRAINT connection_name_parent
    UNIQUE (connection_name, parent_id),

  CONSTRAINT guacamole_connection_parent_fkey
    FOREIGN KEY (parent_id)
    REFERENCES guacamole_connection_group (connection_group_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_connection(parent_id);

--
-- Table of users. Each user has a unique username and a hashed password
-- with corresponding salt. Although the authentication system will always set
-- salted passwords, other systems may set unsalted passwords by simply not
-- providing the salt.
--

CREATE TABLE guacamole_user (

  user_id       serial       NOT NULL,
  entity_id     integer      NOT NULL,

  -- Optionally-salted password
  password_hash bytea        NOT NULL,
  password_salt bytea,
  password_date timestamptz  NOT NULL,

  -- Account disabled/expired status
  disabled      boolean      NOT NULL DEFAULT FALSE,
  expired       boolean      NOT NULL DEFAULT FALSE,

  -- Time-based access restriction
  access_window_start    time,
  access_window_end      time,

  -- Date-based access restriction
  valid_from  date,
  valid_until date,

  -- Timezone used for all date/time comparisons and interpretation
  timezone varchar(64),

  -- Profile information
  full_name           varchar(256),
  email_address       varchar(256),
  organization        varchar(256),
  organizational_role varchar(256),

  PRIMARY KEY (user_id),

  CONSTRAINT guacamole_user_single_entity
    UNIQUE (entity_id),

  CONSTRAINT guacamole_user_entity
    FOREIGN KEY (entity_id)
    REFERENCES guacamole_entity (entity_id)
    ON DELETE CASCADE

);

--
-- Table of sharing profiles. Each sharing profile has a name, associated set
-- of parameters, and a primary connection. The primary connection is the
-- connection that the sharing profile provides access to, and the parameters
-- dictate the restrictions/features which apply to the user joining the
-- connection via the sharing profile.
--

CREATE TABLE guacamole_sharing_profile (

  sharing_profile_id    serial       NOT NULL,
  sharing_profile_name  varchar(128) NOT NULL,
  primary_connection_id integer      NOT NULL,

  PRIMARY KEY (sharing_profile_id),

  CONSTRAINT sharing_profile_name_primary
    UNIQUE (sharing_profile_name, primary_connection_id),

  CONSTRAINT guacamole_sharing_profile_primary_connection
    FOREIGN KEY (primary_connection_id)
    REFERENCES guacamole_connection (connection_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_sharing_profile(primary_connection_id);

--
-- Table of connection parameters. Each parameter is simply a name/value pair
-- associated with a connection.
--

CREATE TABLE guacamole_connection_parameter (

  connection_id   integer       NOT NULL,
  parameter_name  varchar(128)  NOT NULL,
  parameter_value varchar(4096) NOT NULL,

  PRIMARY KEY (connection_id,parameter_name),

  CONSTRAINT guacamole_connection_parameter_connection
    FOREIGN KEY (connection_id)
    REFERENCES guacamole_connection (connection_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_connection_parameter(connection_id);

--
-- Table of sharing profile parameters. Each parameter is simply
-- name/value pair associated with a sharing profile. These parameters dictate
-- the restrictions/features which apply to the user joining the associated
-- connection via the sharing profile.
--

CREATE TABLE guacamole_sharing_profile_parameter (

  sharing_profile_id integer       NOT NULL,
  parameter_name     varchar(128)  NOT NULL,
  parameter_value    varchar(4096) NOT NULL,

  PRIMARY KEY (sharing_profile_id, parameter_name),

  CONSTRAINT guacamole_sharing_profile_parameter_sharing_profile
    FOREIGN KEY (sharing_profile_id)
    REFERENCES guacamole_sharing_profile (sharing_profile_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_sharing_profile_parameter(sharing_profile_id);

--
-- Table of arbitrary user attributes. Each attribute is simply a name/value
-- pair associated with a user. Arbitrary attributes are defined by other
-- extensions. Attributes defined by this extension will be mapped to
-- properly-typed columns of a specific table.
--

CREATE TABLE guacamole_user_attribute (

  user_id         integer       NOT NULL,
  attribute_name  varchar(128)  NOT NULL,
  attribute_value varchar(4096) NOT NULL,

  PRIMARY KEY (user_id, attribute_name),

  CONSTRAINT guacamole_user_attribute_user
    FOREIGN KEY (user_id)
    REFERENCES guacamole_user (user_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_user_attribute(user_id);

--
-- Table of arbitrary connection attributes. Each attribute is simply a
-- name/value pair associated with a connection. Arbitrary attributes are
-- defined by other extensions. Attributes defined by this extension will be
-- mapped to properly-typed columns of a specific table.
--

CREATE TABLE guacamole_connection_attribute (

  connection_id   integer       NOT NULL,
  attribute_name  varchar(128)  NOT NULL,
  attribute_value varchar(4096) NOT NULL,

  PRIMARY KEY (connection_id, attribute_name),

  CONSTRAINT guacamole_connection_attribute_connection
    FOREIGN KEY (connection_id)
    REFERENCES guacamole_connection (connection_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_connection_attribute(connection_id);

--
-- Table of arbitrary connection group attributes. Each attribute is simply a
-- name/value pair associated with a connection group. Arbitrary attributes are
-- defined by other extensions. Attributes defined by this extension will be
-- mapped to properly-typed columns of a specific table.
--

CREATE TABLE guacamole_connection_group_attribute (

  connection_group_id integer       NOT NULL,
  attribute_name      varchar(128)  NOT NULL,
  attribute_value     varchar(4096) NOT NULL,

  PRIMARY KEY (connection_group_id, attribute_name),

  CONSTRAINT guacamole_connection_group_attribute_group
    FOREIGN KEY (connection_group_id)
    REFERENCES guacamole_connection_group (connection_group_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_connection_group_attribute(connection_group_id);

--
-- Table of arbitrary sharing profile attributes. Each attribute is simply a
-- name/value pair associated with a sharing profile. Arbitrary attributes are
-- defined by other extensions. Attributes defined by this extension will be
-- mapped to properly-typed columns of a specific table.
--

CREATE TABLE guacamole_sharing_profile_attribute (

  sharing_profile_id integer       NOT NULL,
  attribute_name     varchar(128)  NOT NULL,
  attribute_value    varchar(4096) NOT NULL,

  PRIMARY KEY (sharing_profile_id, attribute_name),

  CONSTRAINT guacamole_sharing_profile_attribute_sharing_profile
    FOREIGN KEY (sharing_profile_id)
    REFERENCES guacamole_sharing_profile (sharing_profile_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_sharing_profile_attribute(sharing_profile_id);

--
-- Table of connection permissions. Each connection permission grants a user
-- specific access to a connection.
--

CREATE TABLE guacamole_connection_permission (

  entity_id     integer NOT NULL,
  connection_id integer NOT NULL,
  permission    varchar(10) NOT NULL,

  PRIMARY KEY (entity_id, connection_id, permission),

  CONSTRAINT guacamole_connection_permission_entity
    FOREIGN KEY (entity_id)
    REFERENCES guacamole_entity (entity_id)
    ON DELETE CASCADE,

  CONSTRAINT guacamole_connection_permission_connection
    FOREIGN KEY (connection_id)
    REFERENCES guacamole_connection (connection_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_connection_permission(connection_id);
CREATE INDEX ON guacamole_connection_permission(entity_id);

--
-- Table of connection group permissions. Each group permission grants a user
-- specific access to a connection group.
--

CREATE TABLE guacamole_connection_group_permission (

  entity_id           integer NOT NULL,
  connection_group_id integer NOT NULL,
  permission          varchar(10) NOT NULL,

  PRIMARY KEY (entity_id, connection_group_id, permission),

  CONSTRAINT guacamole_connection_group_permission_entity
    FOREIGN KEY (entity_id)
    REFERENCES guacamole_entity (entity_id)
    ON DELETE CASCADE,

  CONSTRAINT guacamole_connection_group_permission_connection_group
    FOREIGN KEY (connection_group_id)
    REFERENCES guacamole_connection_group (connection_group_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_connection_group_permission(connection_group_id);
CREATE INDEX ON guacamole_connection_group_permission(entity_id);

--
-- Table of sharing profile permissions. Each sharing profile permission grants
-- a user specific access to a sharing profile.
--

CREATE TABLE guacamole_sharing_profile_permission (

  entity_id          integer NOT NULL,
  sharing_profile_id integer NOT NULL,
  permission         varchar(10) NOT NULL,

  PRIMARY KEY (entity_id, sharing_profile_id, permission),

  CONSTRAINT guacamole_sharing_profile_permission_entity
    FOREIGN KEY (entity_id)
    REFERENCES guacamole_entity (entity_id)
    ON DELETE CASCADE,

  CONSTRAINT guacamole_sharing_profile_permission_sharing_profile
    FOREIGN KEY (sharing_profile_id)
    REFERENCES guacamole_sharing_profile (sharing_profile_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_sharing_profile_permission(sharing_profile_id);
CREATE INDEX ON guacamole_sharing_profile_permission(entity_id);

--
-- Table of system permissions. Each system permission grants a user a
-- system-level privilege of some kind.
--

CREATE TABLE guacamole_system_permission (

  entity_id  integer NOT NULL,
  permission varchar(32) NOT NULL,

  PRIMARY KEY (entity_id, permission),

  CONSTRAINT guacamole_system_permission_entity
    FOREIGN KEY (entity_id)
    REFERENCES guacamole_entity (entity_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_system_permission(entity_id);

--
-- Table of user permissions. Each user permission grants a user access to
-- another user (the "affected" user) for a specific type of operation.
--

CREATE TABLE guacamole_user_permission (

  entity_id        integer NOT NULL,
  affected_user_id integer NOT NULL,
  permission       varchar(10) NOT NULL,

  PRIMARY KEY (entity_id, affected_user_id, permission),

  CONSTRAINT guacamole_user_permission_entity
    FOREIGN KEY (entity_id)
    REFERENCES guacamole_entity (entity_id)
    ON DELETE CASCADE,

  CONSTRAINT guacamole_user_permission_user
    FOREIGN KEY (affected_user_id)
    REFERENCES guacamole_user (user_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_user_permission(affected_user_id);
CREATE INDEX ON guacamole_user_permission(entity_id);

--
-- Table of connection history records. Each record defines a specific user's
-- session, including the connection used, the start time, and the end time
-- (if any).
--

CREATE TABLE guacamole_connection_history (

  history_id           serial       NOT NULL,
  user_id              integer      DEFAULT NULL,
  username             varchar(128) NOT NULL,
  remote_host          varchar(256) DEFAULT NULL,
  connection_id        integer      DEFAULT NULL,
  connection_name      varchar(128) NOT NULL,
  sharing_profile_id   integer      DEFAULT NULL,
  sharing_profile_name varchar(128) DEFAULT NULL,
  start_date           timestamptz  NOT NULL,
  end_date             timestamptz  DEFAULT NULL,

  PRIMARY KEY (history_id),

  CONSTRAINT guacamole_connection_history_user
    FOREIGN KEY (user_id)
    REFERENCES guacamole_user (user_id)
    ON DELETE SET NULL,

  CONSTRAINT guacamole_connection_history_connection
    FOREIGN KEY (connection_id)
    REFERENCES guacamole_connection (connection_id)
    ON DELETE SET NULL,

  CONSTRAINT guacamole_connection_history_sharing_profile
    FOREIGN KEY (sharing_profile_id)
    REFERENCES guacamole_sharing_profile (sharing_profile_id)
    ON DELETE SET NULL

);

CREATE INDEX ON guacamole_connection_history(user_id);
CREATE INDEX ON guacamole_connection_history(connection_id);
CREATE INDEX ON guacamole_connection_history(sharing_profile_id);
CREATE INDEX ON guacamole_connection_history(start_date);
CREATE INDEX ON guacamole_connection_history(end_date);

--
-- User password history
--

CREATE TABLE guacamole_user_password_history (

  password_history_id serial  NOT NULL,
  user_id             integer NOT NULL,

  -- Salted password
  password_hash bytea        NOT NULL,
  password_salt bytea,
  password_date timestamptz  NOT NULL,

  PRIMARY KEY (password_history_id),

  CONSTRAINT guacamole_user_password_history_user
    FOREIGN KEY (user_id)
    REFERENCES guacamole_user (user_id)
    ON DELETE CASCADE

);

CREATE INDEX ON guacamole_user_password_history(user_id);

--
-- User login/logout history
--

CREATE TABLE guacamole_user_history (

  history_id           serial       NOT NULL,
  user_id              integer      DEFAULT NULL,
  username             varchar(128) NOT NULL,
  remote_host          varchar(256) DEFAULT NULL,
  start_date           timestamptz  NOT NULL,
  end_date             timestamptz  DEFAULT NULL,

  PRIMARY KEY (history_id),

  CONSTRAINT guacamole_user_history_user
    FOREIGN KEY (user_id)
    REFERENCES guacamole_user (user_id)
    ON DELETE SET NULL

);

CREATE INDEX ON guacamole_user_history(user_id);
CREATE INDEX ON guacamole_user_history(start_date);
CREATE INDEX ON guacamole_user_history(end_date);

--
-- The permission defines which system permissions are granted to a specific entity.
--
CREATE TYPE guacamole_system_permission_type AS ENUM(
    'CREATE_CONNECTION',
    'CREATE_CONNECTION_GROUP',
    'CREATE_SHARING_PROFILE',
    'CREATE_USER',
    'ADMINISTER'
);

--
-- The permission defines which object permissions are granted to a specific entity.
--
CREATE TYPE guacamole_object_permission_type AS ENUM(
    'READ',
    'UPDATE',
    'DELETE',
    'ADMINISTER'
);

--
-- Table of entity types. Each entity is either a user or user group.
--

CREATE TABLE guacamole_entity (

  entity_id     serial                  NOT NULL,
  name          varchar(128)            NOT NULL,
  type          guacamole_entity_type   NOT NULL,

  PRIMARY KEY (entity_id),

  CONSTRAINT guacamole_entity_name_scope
    UNIQUE (type, name)

);

CREATE INDEX ON guacamole_entity(name, type);

-- Create default admin user (username: admin, password: admin)
INSERT INTO guacamole_entity (name, type) 
VALUES ('admin', 'USER');

INSERT INTO guacamole_user (entity_id, password_hash, password_salt, password_date)
SELECT 
    entity_id,
    decode('CA458A7D494E3BE824F5E1E175A1556C0F8EEF2C2D7DF3633BEC4A29C4411960', 'hex'),  -- Hashed 'admin' password
    decode('FE24ADC5E11E2B25288D1704ABE67A79', 'hex'),                                  -- Salt
    now()
FROM guacamole_entity
WHERE name = 'admin' AND type = 'USER';

-- Grant admin permissions
INSERT INTO guacamole_system_permission (entity_id, permission)
SELECT entity_id, permission::guacamole_system_permission_type
FROM (
    VALUES
        ('admin', 'CREATE_CONNECTION'),
        ('admin', 'CREATE_CONNECTION_GROUP'),
        ('admin', 'CREATE_USER'),
        ('admin', 'ADMINISTER')
) AS permissions (name, permission)
JOIN guacamole_entity ON permissions.name = guacamole_entity.name AND guacamole_entity.type = 'USER';
