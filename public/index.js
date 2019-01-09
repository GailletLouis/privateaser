'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

//Step 1 : Calculate booking price
function getBarById(id)
{
	for(var bar of bars)
	{
		if(bar.id == id)
		{
			return bar;
		}
	}
}

//Step2 : Recalculate the price (reduceded when more people)
function getReduction(persons)
{
	if(persons > 60) {return 50;}
	else if (persons > 20) {return 30;}
	else if (persons > 10) {return 10;}
	else return 0;
}

function calculateBookingPrice()
{
	for(var event of events)
	{
		var eventBar = getBarById(event.barId);
		var price = event.time * eventBar.pricePerHour; // Adding price per hour
		price += event.persons * eventBar.pricePerPerson; // Adding price per personalba
		price *= (100-getReduction(event.persons))/100;// If a lot of persons : apply reduction
		event.price = price;
	}
}

//Step3 : Calculate insurance, treasury, privateaser
function calculateCommission()
{
	for(var event of events)
	{
		var commission = 0.3 * event.price;
		event.commission.insurance = 0.5 * commission;
		event.commission.treasury = 1 * event.persons;
		event.commission.privateaser = commission - event.commission.insurance - event.commission.treasury;
	}
}

//Step4
function calculateDeductible()
{
	for(var event of events)
	{
		if(event.options.deductibleReduction)
		{
			var deductibleCharge = 1 * event.persons;
			event.price += deductibleCharge;
			event.commission.privateaser += deductibleCharge;
		}
	}
}

//Step5
function getEventById(id)
{
	for(var event of events)
	{
		if(event.id == id)
		{
			return event;
		}
	}
}
//Find the right actor in the paymentlist by var 'who'
function getWho(actor, who)
{
	return actor.payment.find(payment => payment.who === who)
}
function computeActors()
{
	for(var actor of actors)
	{
		var event = getEventById(actor.eventId);
		getWho(actor, "booker").amount = event.price; // Compute booker
		getWho(actor, "bar").amount = event.price - event.commission.insurance - event.commission.treasury - event.commission.privateaser;
		getWho(actor, "insurance").amount = event.commission.insurance;
		getWho(actor, "treasury").amount = event.commission.treasury;
		getWho(actor, "privateaser").amount = event.commission.privateaser;
	}
}

//Step1 & step2
calculateBookingPrice();

//step3
calculateCommission();

//Step4
calculateDeductible();

//Step5
computeActors();

console.log(bars);
console.log(events);
console.log(actors);
