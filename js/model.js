'use strict';

var DATA_URL = 'data/data.json';

/** Person ---------------------------------------------------- */
class Person {
    constructor(personObj) {
        this.name = personObj.name;
        this.country = personObj.country;
        this.medal = personObj.medal;
    }

    set name(name) {
        this._name = name;
        return this;
    }

    set country(country) {
        this._country = country;
        return this;
    }

    set medal(medal) {
        this._medal = medal;
        return this;
    }


    get name() {
        return this._name;
    }


    get country() {
        return this._country;
    }


    get medal() {
        return this._medal;
    }


    getFieldByName(fieldName) {
        let vFieldName;
        if (this.hasOwnProperty(fieldName)) {
            vFieldName = fieldName;
        } else if (this.hasOwnProperty(`_${fieldName}`)) {
            vFieldName = `_${fieldName}`;
        } else {
            console.log(this);
            throw {code:20001, message:`Field ${fieldName} not found`};
        };

        return this[fieldName];
    }
};


/** Persons ---------------------------------------------------- */
class Persons {
    constructor() {
        this._personsData = null;
        this._personsListAll = [];
        this._personsList = [];
    }


    loadData() {
        return $.when($.getJSON(DATA_URL));
    }


    getPersonsData() {
        return this._personsData;
    }


    init(data) {
        this._personsData = data;
        this._personsListAll = [];
        this._personsList = [];

        for (let i = 0; i < this._personsData.length; i++) {
            let personTmp = new Person(this._personsData[i]);
            this._personsListAll.push(personTmp);
            this._personsList = this._personsListAll.filter(() => true);
        };
    }


    getPerson(id) {
        return this._personsList[id];
    }


    _filterByFieldValue(fieldName, fieldValue) {
        let vFieldName, vFieldValue;

        if (arguments.length === 1 && typeof(fieldName) === 'object') {
            let argObj = fieldName;
            vFieldName = argObj['name'];
            vFieldValue = argObj['value'];
        } else {
            vFieldName = fieldName;
            vFieldValue = fieldValue;
        };

        this._personsList = this._personsList.filter(item => item.getFieldByName(vFieldName) === vFieldValue);
    }


    filterByFieldValue(fieldName, fieldValue) {
        this._personsList = this._personsListAll.filter(() => true);
        if (arguments.length === 1) {
            if (Array.isArray(fieldName)) {
                let arr = fieldName;
                for (let i = 0; i < arr.length; i++) {
                    this._filterByFieldValue(arr[i]);
                }
            } else if (typeof(fieldName) === 'object') {
                let argObj = fieldName;
                this._filterByFieldValue(argObj);
            }
        } else {
            this._filterByFieldValue(fieldName, fieldValue);
        }
    }


    get count() {
        return this._personsList.length;
    }


    get countriesList() {
        const names = this._personsListAll.map(item => item.country);
        return names.filter((item, i, ar) => ar.indexOf(item) === i).sort();
    }
};


/** CurrentPerson ---------------------------------------------------- */
class CurrentPerson {
    constructor(persons) {
        this._currentPersonId = 0;
        this.persons = persons;
    }


    set currentId(id) {
        this._currentPersonId = id;
    }


    get currentId() {
        return this._currentPersonId;
    }


    get() {
        return this.persons.getPerson(this._currentPersonId);
    }


    next() {
        if (this._currentPersonId + 1 < this.persons.count) {
            this._currentPersonId++;
            return true;
        };
        return false;
    }


    prev() {
        if (this._currentPersonId > 0) {
            this._currentPersonId--;
            return true;
        };
        return false;
    }
};
