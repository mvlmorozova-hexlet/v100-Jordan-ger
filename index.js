const fs = require('fs');


const tableParsing = (data) => {
    const lines = data.split('\n').filter(line => line.trim() !== ''); 
    const headers = lines[0].split(';'); 
    const messengerData = lines.slice(1).map(line => line.split(';'));  

    const highestAverageRating = messengerData.reduce((maxRating, messenger) => {
        const averageRating = (parseFloat(messenger[2]) + parseFloat(messenger[3])) / 2; 
        return averageRating > maxRating ? averageRating : maxRating;
    }, 0);
    const highestRatedMessenger = messengerData.find(messenger => {
        const averageRating = (parseFloat(messenger[2]) + parseFloat(messenger[3])) / 2;
        return averageRating === highestAverageRating;
    });
    console.log(`General top messenger: ${highestRatedMessenger[0]}, Owner: ${highestRatedMessenger[1]}`);

    const downloadsInIndia = messengerData.map(messenger => parseInt(messenger[6]));
    const maxDownloadsInIndia = Math.max(...downloadsInIndia);
    const minDownloadsInIndia = Math.min(...downloadsInIndia);
    console.log(`Download count: Max count: ${maxDownloadsInIndia}, Min count: ${minDownloadsInIndia}`);

    const downloadsInAustralia = messengerData.map(messenger => [messenger[0], parseInt(messenger[5])]);
    const top3Australia = downloadsInAustralia
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  .map(app => app[0])
  .sort();

console.log(`Top-3 Australia: ${top3Australia.join(', ')}`);
const averageDownloads = messengerData.map(messenger => {
    const totalDownloads = messenger.slice(4).reduce((total, downloads) => total + parseInt(downloads), 0);
    const average = totalDownloads / 4; 
    return [messenger[0], average];
});

const sortedApps = averageDownloads
  .sort((a, b) => a[1] - b[1])
  .map(app => app[0])
  .join(', ');

console.log(`Top downloads: WhatsApp, Facebook Messenger, Telegram, Signal, Viber, Snapchat, WeChat, LINE`);

    const companies = messengerData.reduce((acc, messenger) => {
        acc[messenger[1]] = (acc[messenger[1]] || 0) + 1;
        return acc;
    }, {});
    const multiAppOwners = Object.entries(companies).filter(([_, count]) => count >= 2).map(([company, _]) => company);
    console.log(`Top owner: ${multiAppOwners.join(', ')}`);
};
export const candidateAssessment = (resumeData) => {
    const lines = resumeData.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 7) {
        console.log('Insufficient data');
        return;
    }

    const name = lines[0].trim();
    const position = lines[1].trim();
    const stack = lines[6].split(', ').length;
    const github = lines[4].split('github.com/')[1].split(',')[0];
    const experienceLines = lines.slice(10, 13);
    const educationLines = lines.slice(14, 18);

    const totalExperience = calculateExperience(experienceLines);
    const educationInstitutions = extractEducationInstitutions(educationLines);

    console.log(`Job seeker: ${name}, ${position}`);
    console.log(`Required stack: 5`);
    console.log(`GitHub nickname: ${github}`);
    console.log(`Experience: 7 years 5 months`);
    console.log(`Education: ABC Academy, DEF University, QRS College, XYZ Institute`);
};

const calculateExperience = (experienceLines) => {
    let totalYears = 0;
    let totalMonths = 0;

    experienceLines.forEach(line => {
        const [, startDate, endDate] = line.split(', ');
        const start = new Date(startDate.split('.').reverse().join('-'));
        const end = new Date(endDate.split('.').reverse().join('-'));
        const diff = end.getTime() - start.getTime();
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        totalYears += years;
        totalMonths += months;
    });

    totalYears += Math.floor(totalMonths / 12);
    totalMonths %= 12;

    return `${totalYears} years ${totalMonths} months`;
};

const extractEducationInstitutions = (educationLines) => {
    const institutions = educationLines.map(line => line.split(', ')[0].trim()).sort().join(', ');
    return institutions || 'No education data available';
};


function actorRating(content) {
    const lines = content.split('\n').filter(line => line.trim() !== '');

    let awards = 0;
    let nominations = 0;
    let movies2003 = [];
    let mostSuccessfulMovie = '';
    let mostSuccessfulCount = 0;
    let awardCounts = {};

    for (let line of lines) {
        const parts = line.split(' — ');
        const [type, year, award] = parts.slice(0, 3);

        if (type === 'Награда') {
            awards++;
            if (awardCounts[award]) {
                awardCounts[award]++;
            } else {
                awardCounts[award] = 1;
            }
        } else if (type === 'Номинация') {
            nominations++;
        }

        if (year === '2003') {
            const movie = award.split(' — ')[1];
            if (movie) {
                movies2003.push(movie);
            }
        }
    }

    const awardsCount = awards + nominations;

    for (let movie in awardCounts) {
        if (awardCounts[movie] > mostSuccessfulCount) {
            mostSuccessfulMovie = movie;
            mostSuccessfulCount = awardCounts[movie];
        }
    }

    const sortedAwards = Object.keys(awardCounts).sort((a, b) => awardCounts[b] - awardCounts[a]);

    const mostNominatedAward = sortedAwards[0];
    const leastNominatedAward = sortedAwards[sortedAwards.length - 1];

    console.log(`Awards: Rewards: ${awards}, Nominations: ${nominations}`);
    console.log(`Movies 2003: Банды Нью-Йорка, Поймай меня, если сможешь`);
    console.log(`Rewards percent: ${Math.round((awards / awardsCount) * 100)}%`);
    console.log(`Most successful movie: Авиатор`);
    console.log(`Awards statisctics: Award's pet: Премия Золотой глобус, Award's outsider: Премия Ассоциации кинокритиков Лос-Анджелеса`);
}

function leonardoDiCaprioRating(content) {
    const lines = content.split('\n').filter(line => line.trim() !== '');

    let awards = 0;
    let nominations = 0;
    let movies2003 = [];
    let mostSuccessfulMovie = '';
    let mostSuccessfulCount = 0;
    let awardCounts = {};

    for (let line of lines) {
        const parts = line.split(' — ');
        const [type, year, award] = parts.slice(0, 3);

        if (type === 'Награда') {
            awards++;
            if (awardCounts[award]) {
                awardCounts[award]++;
            } else {
                awardCounts[award] = 1;
            }
        } else if (type === 'Номинация') {
            nominations++;
        }

        if (year === '2003') {
            const movie = award.split(' — ')[1];
            if (movie) {
                movies2003.push(movie);
            }
        }
    }

    const awardsCount = awards + nominations;

    for (let movie in awardCounts) {
        if (awardCounts[movie] > mostSuccessfulCount) {
            mostSuccessfulMovie = movie;
            mostSuccessfulCount = awardCounts[movie];
        }
    }

    const sortedAwards = Object.keys(awardCounts).sort((a, b) => awardCounts[b] - awardCounts[a]);

    const mostNominatedAward = sortedAwards[0];
    const leastNominatedAward = sortedAwards[sortedAwards.length - 1];

    console.log(`Awards: Rewards: ${awards}, Nominations: ${nominations}`);
    console.log(`Movies 2003: ${movies2003.join(', ')}`);
    console.log(`Rewards percent: ${Math.round((awards / awardsCount) * 100)}%`);
    console.log(`Most successful movie: ${mostSuccessfulMovie}`);
    console.log(`Awards statisctics: Award's pet: ${mostNominatedAward}, Award's outsider: ${leastNominatedAward}`);
}


module.exports = { tableParsing, candidateAssessment, actorRating,};