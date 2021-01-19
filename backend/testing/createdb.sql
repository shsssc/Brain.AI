CREATE DATABASE brain;
USE brain;
create table if not exists users
(
    id       int auto_increment
        primary key,
    email    char(64) null,
    password char(64) null,
    constraint users_email_uindex
        unique (email)
);

create table if not exists data
(
    id       int auto_increment
        primary key,
    owner    int                                not null,
    type     enum ('training', 'prediction')    null,
    location varchar(512)                       null comment 'path in cloud storage',
    preview  text                               null,
    name     varchar(64) default 'unnamed data' null,
    constraint data_users_id_fk
        foreign key (owner) references users (id)
            on update cascade on delete cascade
);

create table if not exists models
(
    id       int auto_increment
        primary key,
    owner    int                                 null,
    shared   tinyint(1)  default 0               null,
    location varchar(256)                        null comment 'location in cloud storage',
    metadata text                                null,
    name     varchar(64) default 'unnamed model' null,
    constraint models_users_id_fk
        foreign key (owner) references users (id)
            on update cascade on delete cascade
);

create table if not exists sessions
(
    user_id       int                  not null,
    session_token char(64)             not null
        primary key,
    valid         tinyint(1) default 1 null,
    constraint sessions_users_id_fk
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create table if not exists tasks
(
    id         int auto_increment
        primary key,
    owner      int                                                                              null,
    type       enum ('training', 'prediction', 'preview')                                       not null,
    status     enum ('pending', 'inProgress', 'success', 'failed', 'stopped') default 'pending' not null,
    data       int                                                                              null,
    model      int                                                                              null comment 'note that for training,model should be invalid by default',
    worker     tinyint                                                        default -1        null,
    percentage tinyint                                                        default 0         null,
    constraint tasks_data_id_fk
        foreign key (data) references data (id)
            on update cascade on delete cascade,
    constraint tasks_models_id_fk
        foreign key (model) references models (id)
            on update cascade on delete cascade,
    constraint tasks_users_id_fk
        foreign key (owner) references users (id)
            on update cascade on delete cascade
);

create index tasks_status_index
    on tasks (status);

create index tasks_worker_index
    on tasks (worker);

INSERT INTO brain.users (id, email, password) VALUES (10, 'test@test.com', '4163b6cd881b204fe58b98a45580257810b8ca14d0caa3ebda5e8bc59f87f628');
INSERT INTO brain.users (id, email, password) VALUES (25, 'test@test.comgerger', '1ea7861611faf7e07b0d4db52c198214d5681a512d66d04badd97b990496a813');
INSERT INTO brain.users (id, email, password) VALUES (26, 'test@test.comefw', '4163b6cd881b204fe58b98a45580257810b8ca14d0caa3ebda5e8bc59f87f628');
INSERT INTO brain.users (id, email, password) VALUES (27, 'test@test.comgrerge', '4163b6cd881b204fe58b98a45580257810b8ca14d0caa3ebda5e8bc59f87f628');
INSERT INTO brain.users (id, email, password) VALUES (28, 'a@a.com', 'ccf8f2807e90c3a795009c3f04aa18438e026588678f50abd8ee7688a3c83a81');
INSERT INTO brain.users (id, email, password) VALUES (29, 'test@gmail.com', '967e91ef808967002143039d1af7250ff0dc2bd7a475302e89e621fce43f16b3');
INSERT INTO brain.users (id, email, password) VALUES (30, 'abc123@ucla.edu', 'c77c4d78ebe7d519e708bb488ea9fd4348f5091b848b7ac461fdbc97c161150d');
INSERT INTO brain.users (id, email, password) VALUES (31, 'ttt', 'c13bc52406993a271115cd3153bc05e03a0d3d53c534471a257be5ddec185def');

INSERT INTO brain.models (id, owner, shared, location, metadata, name) VALUES (6, 30, 0, null, null, 'newnewnew');
INSERT INTO brain.models (id, owner, shared, location, metadata, name) VALUES (10, 10, 1, null, null, 'fwe1');
INSERT INTO brain.models (id, owner, shared, location, metadata, name) VALUES (97, 30, 1, 'model/deeplabv3net2.mat', null, 'unnamed model');
INSERT INTO brain.models (id, owner, shared, location, metadata, name) VALUES (98, 30, 1, 'model/03_07_20_23_58_48_838out.mat', '{"Epoch":2,"Iteration":5,"TimeSinceStart":28.07385,"TrainingLoss":0.24029809236526489,"ValidationLoss":[],"BaseLearnRate":0.0020000000949949026,"TrainingAccuracy":89.963547064333554,"TrainingRMSE":86.854461669921875,"ValidationAccuracy":[],"ValidationRMSE":[],"State":"done"}', 'unnamed_03/07/23_58');
INSERT INTO brain.models (id, owner, shared, location, metadata, name) VALUES (100, 28, 1, 'model/03_09_20_02_58_06_966out.mat', '{"Epoch":1,"Iteration":20,"TimeSinceStart":12.677138,"TrainingLoss":0.1207490861415863,"ValidationLoss":[],"BaseLearnRate":0.0020000000949949026,"TrainingAccuracy":93.804059709821431,"TrainingRMSE":69.422523498535156,"ValidationAccuracy":[],"ValidationRMSE":[],"State":"done"}', 'unnamed_03/09/02_58');