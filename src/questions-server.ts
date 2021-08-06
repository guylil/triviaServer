interface Trivia extends Question{
    answer:string
}

interface Pool extends Question{
    possibleAnswers: String[]
}

interface Question {
    type: Pool | Trivia,
    id?: string
    question: string
}

const express = require('express')
const fs = require('fs');

const app = express()
const port = 3000

app.use(
    express.urlencoded({ extended: true })
)
app.use(express.json())

const data = require('./data/data.json')


app.get('/', async (req: any, res: any) => {
    const status = await getQuestionData('0')
    res.status(200).send(`Welcome to Trivia server we currently have ${status} questions, feel free to add more`)
})

app.get('/question/:id', async (req: any, res: any) => {
    console.log('querying for question id: ',req.params.id)
    const question:Question = await getQuestionData(req.params.id)
    res.status(200).send(question)
})

app.put('/question/', async (req: any, res: any) => {
    const parsedQuestion = req.body

    const status = await insertNewQuestion(parsedQuestion)
    res.status(200).send(status)
})

app.post('/question/vote/:id', async (req: any, res: any) => {
    // This endpoint could be split to 2 /vote/pool and /vote/trivia
    const question = await getQuestionData(req.params.id)
    const parsedAnswer = req.body

    if (question.type === 'Trivia') {
        await insertNewTriviaAnswer({...question, answer: parsedAnswer.answer})
        const numOfVotes = data.usersTriviaAnswers.filter((answer: Trivia) => answer.id === question.id).length
        res.status(200).send(`${numOfVotes} voted (and you too...)`)

    } else if (question.type === 'Pool') {
        let pastVotes = data.usersPoolAnswers.find((votesArr: Pool) => votesArr.id === req.params.id)
        const isAnswerValid = question.possibleAnswers.find((pAnswer: string) => pAnswer === parsedAnswer.answer)

        if (!isAnswerValid) {
            res.status(400).send('please vote correctly ')
        }

        if (!pastVotes) {
            pastVotes = {
                id: question.id,
                usersAnswers: {}
            }
            data.usersPoolAnswers.push(pastVotes)
        }

        if (!pastVotes.usersAnswers[parsedAnswer.answer]) {
            pastVotes.usersAnswers[parsedAnswer.answer] = 1

        } else {
            pastVotes.usersAnswers[parsedAnswer.answer] += 1
        }

        await insertNewPoolAnswer(data.usersPoolAnswers)
        res.status(200).send(`The results so far: ${JSON.stringify(pastVotes.usersAnswers)}`)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



// All these functions should be in other access layer module
async function insertNewQuestion(dataToInsert: Question) {
    const newId = Math.floor(Math.random()*100000000000).toString()
    dataToInsert.id = newId

    let newData = data
    newData.questions.push(dataToInsert)
    return saveToDB(newData)
        .then(()=>`Saved!
                    question id: ${newId}`)
        .catch(err=>console.log(err))
}

async function insertNewTriviaAnswer(answer: Trivia | Pool){

    let newData = data
    newData.usersTriviaAnswers.push(answer)
    return saveToDB(newData)
        .then(()=>{`Your vote has been registered`})
        .catch(err => console.log(err))
}

async function insertNewPoolAnswer(newResults:Array<Pool>){

    let newData = data
    newData.usersPoolAnswers = newResults
    return saveToDB(newData)
        .then(()=>{`Your vote has been registered`})
        .catch(err => console.log(err))
}

async function getQuestionData(id: string) {
    return new Promise<any>(
        (resolve, reject) => {

            if (id==='0'){
                resolve(data.questions.length)
            }
            const question:Question = data.questions.find((question:Question) => question.id === id)
            if (question){
                resolve(question)
            }
        }
    )
}

async function saveToDB(newData:any){

    return new Promise<any>(
        (resolve, reject) => {
            fs.writeFile(`${__dirname}/data/data.json`, JSON.stringify(newData), 'utf-8',
                function(err: any) {
                    if (err) reject(err)
                    resolve(`success!`)
                })
        }
    )
}
