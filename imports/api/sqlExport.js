export class SQLDatabase {
    constructor(tables) {
        const create_db = [
            'DROP DATABASE IF EXISTS cpd_observations',
            `CREATE DATABASE cpd_observations;\\c cpd_observations`,
        ].join(';')
        this.statement = `${create_db}\n${tables.map(t => t.create + t.inserts.join(';\n')).join(';\n')};`
    }
}

export class Staff {
    static create = `DROP TABLE IF EXISTS staff; CREATE TABLE staff (id INTEGER PRIMARY KEY, email VARCHAR(255), fullname VARCHAR(255));\n`;
    static inserts = []
    constructor(profile) {
        const id = this.constructor.inserts.length + 1
        const {
            email,
            displayName
        } = profile
        const statement = `INSERT INTO staff(id, email, fullname) VALUES (${id},'${email}','${displayName}')`
        this.constructor.inserts.push(statement)
    }
}

export class Tag {
    static create = `DROP TABLE IF EXISTS tags; CREATE TABLE tags (id INTEGER PRIMARY KEY, value VARCHAR(255), label VARCHAR(255));\n`
    static inserts = []
    constructor ({value, label}) {
        const id = this.constructor.inserts.length + 1
        const statement = `INSERT INTO tags(id, value, label) VALUES (${id},'${value}','${label}')`
        this.constructor.inserts.push(statement)
    }
}

export class Observation {
    static create = `DROP TABLE IF EXISTS observations; CREATE TABLE observations (
        id INTEGER PRIMARY KEY,
        _id VARCHAR(255),
        date TIMESTAMP,
        observer VARCHAR(255),
        observed VARCHAR(255),
        type INTEGER,
        reflection TEXT,
        feedback TEXT,
        recording_url TEXT
    );\n`
    static inserts = []
    constructor(observation) {
        const id = this.constructor.inserts.length + 1
        const {
            _id,
            calEvt_date,
            observer,
            observed,
            obs_type,
            reflection,
            feedback,
            recording_url
        } = observation
        const statement = `INSERT INTO observations(id, _id, date, observer, observed, type, reflection, feedback, recording_url) VALUES (
            ${id},
            '${_id}',
            '${calEvt_date}',
            '${observer.email}',
            '${observed.email}',
            ${obs_type || 1},
            '${Buffer.from(reflection, 'base64').toString('base64')}',
            '${Buffer.from(feedback, 'base64').toString('base64')}',
            '${recording_url}'
        )`
        this.constructor.inserts.push(statement)
    }
}

export class ObservationTags {
    static create = `DROP TABLE IF EXISTS observations_tags; CREATE TABLE observations_tags (
        id INTEGER PRIMARY KEY,
        email VARCHAR(255),
        tag VARCHAR(255),
        observation_id VARCHAR(255)
    );\n`
    static inserts = []
    constructor(observation) {
        observation.tags.forEach(tag => {
            const id = this.constructor.inserts.length + 1
            const statement = `INSERT INTO observations_tags(id, email, tag, observation_id) VALUES (${id},'${observation.observed.email}', '${tag.value}','${observation._id}')`
            this.constructor.inserts.push(statement)
        })
    }
}
