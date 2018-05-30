/* global fetch:false */
/* global localStorage:false */
/* global location:false */

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
    const [ token ] = await getToken()

    if (!token) {
      window.location = '/login'
      return
    }
    this.setState({ token })

    this.setState({
      teamBadges: await getTeamBadges()
    })

  }

  async handleAwardButtonClick(e) {
    e.preventDefault()
    await awardBadge(this.state.token, this.state.badgeIdSelected)

    this.setState({
      message: { color: 'green', text: 'Badge awarded!' }
    })
    setTimeout(() => {
      this.setState({
        message: null
      })
    }, 3000)

  }

  teamBadgeSelectChange(e) {
    this.setState({
      badgeIdSelected: parseInt(e.target.value)
    })
  }

  render() {
    return <div>
      <form>
        {this.state.message && <div style={{
          color: this.state.message.color,
          fontWeight: 'bold'
        }}>{this.state.message.text}
        </div>}
        {<select
          id="badges"
          name="badges"
          onChange={this.teamBadgeSelectChange.bind(this)}
        >
          <option key="default" value="-1">-- Select Badge -- </option>
          {this.state.teamBadges && this.state.teamBadges.map(badge =>
            <option key={badge.id} value={badge.id}>{badge.name}</option>
          )}
        </select>}
        <button
          disabled={!this.state.badgeIdSelected}
          onClick={this.handleAwardButtonClick.bind(this)}
        >Award this badge to me</button>
      </form>
    </div>
  }
}

const getTeamBadges = async () => (await fetch('/team-badges')).json()

const awardBadge = (token, id) =>
  fetch('/award-badge', {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      token: token,
      badge: id
    })})

async function getToken() {
  const codeMatch = location.search.match(/code=(.+)$/)
  const code = codeMatch && codeMatch[1]
  const token = localStorage.getItem('token')
  const exp = parseInt(localStorage.getItem('token_expiration'))
  const isExpired = Date.now() > exp

  if (token && !isExpired) {
    return token
  }

  if (code) {
    return loadTokenFromCode(code)
  }

  return null
}

function loadTokenFromCode(code) {
  return fetch('/patreon_token?code=' + code, { method: 'post' })
    .then(r => r.json())
    .then(({ access_token, expires_in }) => {
      localStorage.setItem('token', access_token)
      localStorage.setItem('token_expiration', (expires_in * 1000) + Date.now())
      return access_token
    })
}