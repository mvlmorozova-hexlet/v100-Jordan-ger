const fs = require('fs');

const calculateExperience = (experienceLines) => {
    const experiences = experienceLines.map(line => {
        const [start, end] = line.split(' - ').map(date => {
            const [month, year] = date.split('/');
            return { month: parseInt(month), year: parseInt(year) };
        });
        return { start, end };
    });

    const totalMonths = experiences.reduce((total, exp) => {
        const startYearMonths = exp.start.year * 12 + exp.start.month;
        const endYearMonths = exp.end.year * 12 + exp.end.month;
        return total + (endYearMonths - startYearMonths);
    }, 0);

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return `${years} years ${months} months`;
};

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
    const top3Australia = downloadsInAustralia.sort((a, b) => b[1] - a[1]).slice(0, 3).map(app => app[0]);
    console.log(`Top-3 Australia: ${top3Australia.join(', ')}`);

    const averageDownloads = messengerData.map(messenger => {
        const totalDownloads = messenger.slice(4).reduce((total, downloads) => total + parseInt(downloads), 0);
        const average = totalDownloads / 4; 
        return [messenger[0], average];
    });
    const sortedApps = averageDownloads.sort((a, b) => a[1] - b[1]).map(app => app[0]);
    console.log(`Top downloads: ${sortedApps.join(', ')}`);

    const companies = messengerData.reduce((acc, messenger) => {
        acc[messenger[1]] = (acc[messenger[1]] || 0) + 1;
        return acc;
    }, {});
    const multiAppOwners = Object.entries(companies).filter(([_, count]) => count >= 2).map(([company, _]) => company);
    console.log(`Top owner: ${multiAppOwners.join(', ')}`);
};
const candidateAssessment = (resumeData) => {
    const lines = resumeData.split('\n').filter(line => line.trim() !== ''); 
    if (lines.length < 19) {
        console.error('Insufficient data');
        return;
    }

    const name = lines[0];
    const position = lines[1];
    const stack = lines[17].split(', ');
    const github = lines[5].split('github.com/')[1].split(',')[0];
    const experienceLines = lines.slice(11, 14);
    const educationLines = lines.slice(15, 19);

    console.log(`Job seeker: ${name}`);
    console.log(`Position: ${position}`);
    console.log(`Required stack: ${stack.length}`);
    console.log(`GitHub nickname: ${github}`);

    const totalExperience = calculateExperience(experienceLines);
    console.log(`Experience: ${totalExperience}`);

    const educationInstitutions = educationLines[0].split(', ').sort();
    console.log(`Education: ${educationInstitutions.join(', ')}`);
};

const actorRating = (csvFilePath) => {
    if (!csvFilePath || typeof csvFilePath !== 'string' || csvFilePath.length > 100) {
        console.error('Invalid file path');
        return;
    }
    if (csvFilePath.length > 100) {
        console.error('File path is too long');
        return;
    }

    let data;
    try {
        data = fs.readFileSync(csvFilePath, 'utf-8');
    } catch (err) {
        console.error('Error reading file:', err);
        return;
    }

    const lines = data.trim().split('\n');

    if (lines.length < 19) {
        console.error('Insufficient data');
        return;
    }

    const awardsCount = lines.filter(line => line.startsWith('Награда')).length;
    const nominationsCount = lines.filter(line => line.startsWith('Номинация')).length;

    console.log(`Awards: Rewards: ${awardsCount}, Nominations: ${nominationsCount}`);

    const movies2003 = lines.filter(line => line.startsWith('Награда') && line.includes('2003'))
        .map(line => line.split(' — ')[3])
        .sort();

    console.log(`Movies 2003: ${movies2003.join(', ')}`);

    const totalAwards = awardsCount + nominationsCount;
    const awardsPercent = Math.round((awardsCount / (awardsCount + nominationsCount)) * 100);
    console.log(`Rewards percent: ${awardsPercent}%`);

    const moviesWithAwards = lines.filter(line => line.startsWith('Награда'))
        .map(line => line.split(' — ')[3]);
    const awardsFrequency = moviesWithAwards.reduce((acc, movie) => {
        acc[movie] = (acc[movie] || 0) + 1;
        return acc;
    }, {});
    const mostSuccessfulMovie = Object.keys(awardsFrequency).reduce((a, b) => awardsFrequency[a] > awardsFrequency[b] ? a : b);
    console.log(`Most successful movie: ${mostSuccessfulMovie}`);
};

module.exports = { tableParsing, candidateAssessment, actorRating };