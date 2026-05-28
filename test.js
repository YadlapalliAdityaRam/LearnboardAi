fetch('https://learnboardai.onrender.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'mutation { generateLesson(topic: "Science", pages: 2) { slides { title } } }' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
