'use strict';

(function() {
    function forEach(ctx, func) {
        try {
            return ctx.forEach(func);
        } catch(e) {
            return Array.prototype.forEach.call(ctx, func);
        }
    }


    class App {
        constructor() {
            this._appElem = document.querySelector('#app');
            this._currPerson = null;
            this._selectedMedal = null;
            this._selectedCountry = null;

            this.regHelpers();
            this.addSelectorEventListener();
            this.addNavBtnListeners();
            this.addMedalsEventListeners();
            this.fillCountriesSelector();
            this.renderPerson();
        }


        get selectedCountry() {
            return this._selectedCountry || all;
        }


        get selectedMedal() {
            return this._selectedMedal || all;
        }


        clickSelector(event) {
            this._selectedCountry = event.target.value;
            this.filterPersons();
            this.renderPerson();
        }


        addSelectorEventListener() {
            forEach(this._appElem.querySelectorAll('.countries'), item => item.addEventListener('change', this.clickSelector.bind(this)));
        }


        _removeBtnsActiveClass() {
            forEach(this._appElem.querySelectorAll('.medals .btn'), item => item.classList.remove('active'));
        }


        clickMedalBtn(event) {
            this._removeBtnsActiveClass();

            const attr = event.target.getAttribute('data-medal-type');

            if (attr) {
                this._selectedMedal = attr[0];
            } else {
                this._selectedMedal = null;
            };

            this.filterPersons();
            this.renderPerson();

            event.target.classList.add('active');
        }


        addMedalsEventListeners() {
            forEach(this._appElem.querySelectorAll('.medals span'), item => item.addEventListener('click', this.clickMedalBtn.bind(this)));
        }


        clickNavBtn(event) {
            let flag;

            if (event.target.classList.contains('btn--next')) {
                flag = currentPerson.next();
            } else {
                flag = currentPerson.prev();
            }

            if (flag) {
                this.renderPerson();
            }
        }


        addNavBtnListeners() {
            forEach(this._appElem.querySelectorAll('.pages .btn'), item => item.addEventListener('click', this.clickNavBtn.bind(this)));
        }


        filterPersons() {
            const dataFilter = [];

            if (!!this._selectedCountry && this._selectedCountry.toLowerCase() != 'all') {
                dataFilter.push({name:'country', value:this._selectedCountry});
            };

            if (this._selectedMedal && this._selectedMedal.toLowerCase() != 'a') {
                dataFilter.push({name:'medal', value:this._selectedMedal});
            }

            persons.filterByFieldValue(dataFilter);

            currentPerson.currentId = 0;
        }


        get currentPersonsId() {
            return currentPerson.currentId;
        }


        get personsCount() {
            return persons.count;
        }


        get templateObj() {
            return { name: this._currPerson.name, country: this._currPerson.country };
        }


        get countriesList() {
            return persons.countriesList.map(item => { return { value:item, title: item } });
        }


        renderPerson() {
            this._currPerson = currentPerson.get();

            let template = Handlebars.compile(this._appElem.querySelector('.person-template').innerHTML);
            let html = template(this.templateObj);
            this._appElem.querySelector('.template-holder').innerHTML = html;

            this._appElem.querySelector('.pages__info .item-no').innerHTML = this.currentPersonsId + 1;
            this._appElem.querySelector('.pages__info .items-count').innerHTML = this.personsCount;
        }


        fillCountriesSelector() {
            let countriesList = this.countriesList;
            countriesList.unshift({value:null, title:'all countries'});

            let template = Handlebars.compile(this._appElem.querySelector('.countries-template').innerHTML);

            let html = template({ nav: countriesList });
            this._appElem.querySelector('.countries').innerHTML = html;
        }


        regHelpers() {
            Handlebars.registerHelper('list', function(context, options) {
                var ret = '';
                for(var i=0, j=context.length; i<j; i++) {
                    ret = ret + options.fn(context[i]);
                };
                return ret;
            });
        }
    };


    /** ----- RUN APP ----------------------------------------------------------- */
    var app, currentPerson;

    var persons = new Persons();

    persons.loadData()
           .then(data => persons.init(data))
           .then(() => currentPerson = new CurrentPerson(persons))
           .then(() => app = new App());
})();
