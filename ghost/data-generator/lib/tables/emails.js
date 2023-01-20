const TableImporter = require('./base');
const {faker} = require('@faker-js/faker');
const generateEvents = require('../utils/event-generator');
const {luck} = require('../utils/random');
const dateToDatabaseString = require('../utils/database-date');

class EmailsImporter extends TableImporter {
    constructor(knex, {newsletters}) {
        super('emails', knex);
        this.newsletters = newsletters;
    }

    setImportOptions({model}) {
        this.model = model;
    }

    generate() {
        const id = faker.database.mongodbObjectId();

        const newsletter = luck(90)
            ? this.newsletters.find(nl => nl.name === 'Regular premium')
            : this.newsletters.find(nl => nl.name !== 'Regular premium');

        const timestamp = luck(60)
            ? new Date(this.model.published_at)
            : generateEvents({
                shape: 'ease-out',
                trend: 'negative',
                total: 1,
                startTime: new Date(this.model.published_at),
                endTime: new Date()
            })[0];

        console.log(`Type: ${typeof timestamp}, Value: ${timestamp}`);

        return {
            id,
            uuid: faker.datatype.uuid(),
            post_id: this.model.id,
            status: 'submitted',
            recipient_filter: '', // TODO: Add recipient filter?
            email_count: 0, // TODO: Set email count based on # of members who subscribe to a newsletter
            delivered_count: 0, // TODO: Set to % of emails sent
            opened_count: 0, // TODO: Set to % of emails delivered
            failed_count: 0, // TODO: Set to small % of emails not delivered
            subject: this.title,
            source_type: 'html',
            track_opens: true,
            track_clicks: true,
            feedback_enabled: true,
            submitted_at: dateToDatabaseString(timestamp),
            newsletter_id: newsletter.id,
            created_at: dateToDatabaseString(timestamp),
            created_by: 'unused',
            updated_at: dateToDatabaseString(timestamp),
            updated_by: 'unused'
        };
    }
}

module.exports = EmailsImporter;
