class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: []
    }
    this.addTracksToBirdlist = this.addTracksToBirdlist.bind(this)
    this.delayBirdlistPopulating = this.delayBirdlistPopulating.bind(this)
  }

  componentDidMount() {
    let userID = this.props.current_user.uid;
    let userToken = this.props.current_user.token;
    let playlistID = this.props.playlistID;

    {/* Get a list of current user's 5 top tracks */}
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/tracks?limit=5",
      method: "GET",
      headers: {
        "Authorization": `Bearer ${userToken}`,
      }
    })
    .done((response) => {
      let trackURIs = []
      for (var i = 0; i < response.items.length; i++) {
        trackURIs.push(response.items[i].uri)
      }
      this.setState({tracks: this.state.tracks.concat(trackURIs)})
      {/* Add those 5 tracks to Birdlist */}
    }.bind(this))
  }

  addTracksToBirdlist(tracks, userToken, userID, playlistID) {
    $.ajax({
      url: `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks?uris=${tracks[0]},${tracks[1]},${tracks[2]},${tracks[3]},${tracks[4]}`,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userToken}`,
        "Content-Type": "application/json"
      }
    })
    .done((response) => {
      console.log(response)
    })
  }

  delayBirdlistPopulating(tracks, userToken, userID, playlistID) {
    if (tracks.length > 0) {
      this.addTracksToBirdlist(tracks, userToken, userID, playlistID)
    }
  }

  render() {
    return(
      <div>
        {this.delayBirdlistPopulating(this.state.tracks, this.props.current_user.token, this.props.current_user.uid, this.props.playlistID)}
      </div>
    )
  }
}
