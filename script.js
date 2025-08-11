const allIngredients = ['water', 'sugar', 'salt', 'vinegar', 'baking soda', 'lemon juice', 'honey', 'olive oil', 'garlic', 'ginger', 'turmeric', 'cinnamon', 'pepper', 'mint', 'oregano'];
let correctIngredients = ['water', 'sugar', 'salt', 'vinegar'];
let neededSteps = Array.from({ length: 3 }, () => ['stir', 'heat', 'cool'][Math.floor(Math.random() * 3)]);

let infected = 1;
let contacts = 10;
let numberOfPeople = Math.floor(Math.random() * 1001) + 1000;

function spread(numInfected, numCanCatchVirus, populationSize, dailyContacts) {
    const percentCanCatchVirus = numCanCatchVirus / populationSize;
    let totalNewlyInfected = 0;
    for (let i = 0; i < numInfected; i++) {
        const numContacts = Math.floor(Math.random() * (dailyContacts * 2 + 1));
        const contactsCanCatchVirus = numContacts * percentCanCatchVirus;
        const newlyInfected = contactsCanCatchVirus * (Math.random() * (0.1 - 0.01) + 0.01);
        totalNewlyInfected += newlyInfected;
    }
    return Math.min(Math.round(totalNewlyInfected), numCanCatchVirus);
}

class Game {
    static async make(steps, steps2) {
        console.log('You have chosen to make your medicine');
        console.log('You have the following ingredients:');
        allIngredients.forEach(ing => console.log('- ' + ing));

        const prompt = require('prompt-sync')();
        const selectedIngredients = [];

        for (let i = 1; i <= 7; i++) {
            const input = prompt(`ingredient ${i}: `);
            if (!allIngredients.includes(input)) {
                console.log('Invalid ingredients. You have officially failed.');
                return [steps2, steps];
            }
            selectedIngredients.push(input);
        }

        console.log(`You have made your medicine with the ingredients:\n${selectedIngredients.join(', ')}`);

        [selectedIngredients[0], selectedIngredients[1], selectedIngredients[2]].forEach(ing => {
            if (!steps.includes(ing)) steps.push(ing);
        });

        for (let i = 0; i < 5; i++) {
            console.log('Now you need to perform the following steps in the correct order:');
            const choice = prompt('Options: stir, heat, cool, quit\nWhat would you like to do? ').toLowerCase();

            if (['stir', 'heat', 'cool'].includes(choice)) {
                console.log(`You have chosen to ${choice} the mixture.`);
                const success = Math.random() < 0.5;

                if (success) {
                    console.log(`${choice[0].toUpperCase() + choice.slice(1)}ed successfully!`);
                    steps2.push(choice);
                    if (JSON.stringify(steps2) === JSON.stringify(neededSteps) &&
                        correctIngredients.every(ing => selectedIngredients.slice(0, 3).includes(ing))) {
                        console.log('You have successfully made your medicine!');
                        return ['correct', steps];
                    }
                } else {
                    console.log(`You ${choice} too much and ruined the mixture.`);
                }
            } else if (choice === 'quit') {
                console.log('You have chosen to quit.');
                break;
            } else {
                console.log('Invalid choice. Please try again.');
            }
        }
        return [steps2, steps];
    }

    static advertise(peopleYes) {
        const prompt = require('prompt-sync')();
        console.log(`You have ${peopleYes} people who are willing to try your medicine`);
        const type = prompt('How would you like to advertise your medicine? (social media, word of mouth, flyer, billboard): ').toLowerCase();

        if (type === 'social media') {
            peopleYes += Math.floor(Math.random() * 2001) - 1000;
        } else if (type === 'word of mouth') {
            peopleYes += Math.floor(Math.random() * 41) + 10;
        } else if (type === 'flyer') {
            peopleYes += Math.floor(Math.random() * 11) + 10;
        } else if (type === 'billboard') {
            peopleYes += Math.floor(Math.random() * 51) + 10;
        } else {
            console.log('Invalid advertisement type. No additional people will be added.');
        }
        return peopleYes;
    }
}

async function main() {
    const prompt = require('prompt-sync')();
    let c = [];
    let chosen = 0;
    let e = chosen;

    console.log('Welcome to the Virus Spread Simulation');
    console.log('You are a scientist trying to stop a virus from spreading.');
    prompt('Press enter to continue');
    // console.log(neededSteps);

    for (let day = 1; day <= 90; day++) {
        let notInfected = numberOfPeople - infected;
        infected += spread(infected, notInfected, numberOfPeople, contacts);
        console.log(`Day ${day} - Infected: ${infected}`);

        let d = prompt('Would you like to begin making your medicine? ');
        let a = '', b = [];
        if (d.toLowerCase() === 'yes' || d.toLowerCase() === 'y') {
            [a, b] = await Game.make(c, []);
            c = b;
        }

        d = prompt('Would you like to advertise your medicine? ');
        if (d.toLowerCase() === 'yes' || d.toLowerCase() === 'y') {
            e = Game.advertise(e);
        }

        let y = true;
        if (a === 'correct') {
            for (let i = 0; i < e; i++) {
                if (infected > 0) infected--;
                else {
                    infected = 0;
                    console.log('No more people to cure');
                    y = false;
                    break;
                }
            }
            if (y) console.log(`You have successfully cured ${e > 0 ? e : 0} people.`);
        }

        if (!y) {
            console.log('You have cured EVERYONE');
            break;
        }

        if (infected >= numberOfPeople) {
            console.log(`All infected on day ${day}`);
            break;
        }
    }
}

main()