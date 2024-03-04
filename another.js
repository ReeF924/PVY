let totalTimeTodayMs = 0;
const todayMidnight = new Date();
todayMidnight.setHours(0,0,0,0);
const nextMidnight = new Date(todayMidnight);
nextMidnight.setDate(nextMidnight.getDate() + 1);

console.log(todayMidnight);
console.log(nextMidnight);