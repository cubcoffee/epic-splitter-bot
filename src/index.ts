import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {

  app.on(['issues.opened', 'issues.labeled'], async (context: Context) => {

    // console.log(context)

    if (context.payload.issue && context.payload.issue && context.payload.issue.body) {
      const labels: any[] = await context.payload.issue.labels
      console.log(labels)
      if (!labels || labels.length === 0 || !labels.filter(l => l.name.toLowerCase() === 'epic')) {
        console.log('semm label')
        return
      }

      const payload = await context.payload.issue.body
      const payloadTraeted = convertToArray(payload)

      if (!payloadTraeted) {
        return
      }

      createIssues(context, payloadTraeted)

    }
  })
}

const createIssues = async (context: Context, payload: string[]) => {

  const { owner, repo } = context.repo();

  payload.forEach(async (task) => {
    await context.github.issues.create({ owner: owner, repo: repo, title: task });
  })
}


const convertToArray = (payload: string) => {
  const payloadTraeted = payload.split('\r\n').map((current: string) => {
    return current.replace('- [ ] ', '').toLowerCase().replace('- [x] ', '')
  })

  return payloadTraeted
}