import React from 'react'

export default class Main extends React.Component {

  constructor() {
    super()
    this.state = {
      teamBadges: null,
      token: null
    }
  }

  async componentDidMount() {
    this.setState({
      teamBadges: await getTeamBadges()
    })
  }

  render() {
    return <div>
      <form>
        {this.state.teamBadges && <select id="badge" name="badge">
          {this.state.teamBadges.map(badge =>
            <option key={badge.id} value={badge.id}>{badge.name}</option>
          )}
        </select>}
      </form>
    </div>
  }
}

const getTeamBadges = async () => (await fetch('/team-badges')).json()