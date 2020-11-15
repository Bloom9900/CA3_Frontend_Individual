import React, { useEffect, useState } from 'react';
import { Prompt, Link } from 'react-router-dom';
import apiFacade from './apiFacade';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from "jwt-decode";
import "./App.css";


export function Home() {
    return (
        <div>
            <div>
                <h2>Welcome!</h2>
                <hr></hr>
            </div>
            <div>
                <h5>How to use our API?</h5>
                    <ul>
                    <li>For all visitors of the website:</li>
                        <ul>
                            <li>The "Home" tab:</li>
                            <ul>
                                <li>This page!</li>
                            </ul>
                            <li>The "Address Info" tab:</li>
                            <ul>
                                <li>Enter an address and find the nearest postal box as well as a weather report from the city you entered.</li>
                            </ul>
                            <li>The "Login" tab:</li>
                            <ul>
                                <li>Login and gain access to more content!</li>
                            </ul>
                        </ul>

                        <br></br>

                        <li>If you're logged in (more content):</li>
                        <ul>
                            <li>As user:</li>
                            <ul>
                                <li>The "Movies" tab:</li>
                                <ul>
                                    <li>Enter a movie title, and get a corresponding review summary and a link to the full review from the New York Times.</li>
                                </ul>
                            </ul>
                            <li>As admin:</li>
                            <ul>
                                <li>The "Digital Ocean Info" tab:</li>
                                <ul>
                                    <li>Lookup information about the Droplets that the hoster has.</li>
                                </ul>
                            </ul>
                        </ul>

                    </ul>
            </div>
        </div>
    );
}

export function Login({ login }) {

    const init = { username: "", password: "" };
    const [loginCredentials, setLoginCredentials] = useState(init);

    const performLogin = (evt) => {
        evt.preventDefault();
        login(loginCredentials.username, loginCredentials.password);
    }
    const onChange = (evt) => {
        setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
    }
    return (
        <div>
            <h2>Login here</h2>
            <form onChange={onChange}>
                <input placeholder="Username" id="username" />
                <input placeholder="Password" id="password" />
                <button onClick={performLogin}>Login</button>
            </form>
        </div>
    )
}

export function LoggedIn({username}) {

const  token = apiFacade.getToken();
const  decoded = jwt_decode(token); // jwt_decode is an external library
    return (
        <div>
            <h2>You are now logged in!</h2>
            <p>Welcome {username}, your role is: {decoded.roles}</p>
        </div>
    )
}

export function DigitalOcean() {

    const [string, setString] = useState('');
    const [droplets, setDroplets] = useState([]);
    const display = droplets.map((droplet, index) => {
        const network = droplet.networks.v4[0];
        return (
            <React.Fragment>
                <tr>
                    <th>Droplet Name</th>
                    <td>{droplet.name}</td>
                </tr>
                <tr>
                    <th>Created At</th>
                    <td>{droplet.created_at}</td>
                </tr>
                <tr>
                    <th>Memory</th>
                    <td>{droplet.memory} MB</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>{droplet.status}</td>
                </tr>
                <tr>
                    <th>Location</th>
                    <td>{droplet.region.name}</td>
                </tr>
                <tr>
                    <th>Monthly price</th>
                    <td>${droplet.size.price_monthly}</td>
                </tr>
                <tr>
                    <th>Gateway</th>
                    <td>{network.gateway}</td>
                </tr>
                <tr>
                    <th>IP Address</th>
                    <td>{network.ip_address}</td>
                </tr>
                <tr>
                    <th>Netmask</th>
                    <td>{network.netmask}</td>
                </tr>
            </React.Fragment>
        )
    })
    
    useEffect (() => {
               apiFacade.getDigitalOceanInfo()
               .then(data => setDroplets(data.droplets))
    }, [string])


    return (
        <div>
            <Table striped bordered hover>
                {display}
            </Table>
        </div>
    )
}

export function Movies() {

    const [movieSearchWord, setMovieSearchWord] = useState("");
    const [movieArray, setMovieArray] = useState([]);

    const handleSubmit = event => {
        event.preventDefault();
        apiFacade.getMovieReviews(movieSearchWord)
        .then(data => {
            const array = data.results;
            setMovieArray(array);
        })
      };


      const allMovies = movieArray.map((movie, index)=> (
        <div>
            <ul key={index+1}>
                <li>{movie.display_title} - <a href={movie.link.url}>Details</a></li>
                <p>Review Summary: {movie.summary_short}</p>
            </ul>
            <hr></hr>
        </div>
        )
    );

    return (
        <div>
            <div>
                <input placeholder="Enter movie title" onChange={(event) => setMovieSearchWord(event.target.value)}/>
                <button onClick={handleSubmit}>Submit</button>
            </div>
            <br></br>
            <div>
                {allMovies}
            </div>
        </div>
    );
}

export function Address() {
    const initialWeather = {
        Sunrise: "",
        Sunset: "",
        Datetime: "",
        Cityname: "",
        Temperature: "",
        ApparentTemperature: "",
        Description: ""
      }
      const [weather, setWeather] = useState(initialWeather);
    
      const initialValue = {
        city: "",
        postalCode: "",
        streetName: "",
        streetNumber: ""
      }
    
      const [address, setAddress] = useState(initialValue);
      const [servicePoints, setServicePoints] = useState([]);
      let [isBlocking, setIsBlocking] = useState(false);
    
      const handleChange = event => {
        const { id, value } = event.target;
        setIsBlocking(event.target.value.length > 0);
        setAddress({ ...address, [id]: value })
      };
    
      const handleSubmit = event => {
        event.preventDefault();
        apiFacade.getServicePoints(address)
        .then(data => {
          const temp = data.weather.data[0];
          setServicePoints(data.postnord.servicePointInformationResponse.servicePoints);
          setWeather({
            Sunrise: temp.sunrise,
            Sunset: temp.sunset,
            Datetime: temp.datetime,
            Cityname: temp.city_name,
            Temperature: temp.temp,
            ApparentTemperature: temp.app_temp,
            Description: temp.weather.description
          })
        })
      };

      return (
          <div>
            <AddressInfo isBlocking={isBlocking} handleChange={handleChange} handleSubmit={handleSubmit} servicePoints={servicePoints} />
            <WeatherInfo weather={weather} />
          </div>
      )
}

export function AddressInfo({isBlocking, handleChange, handleSubmit, servicePoints }) {
    

    const allServicePoints = servicePoints.map(servicePoint => (
        <ul key={servicePoint.servicePointId}>
            <li>{servicePoint.servicePointId}</li>
            <li>{servicePoint.name}</li>
        </ul>
        )
    );

    return (
        <div>
            <h2>What's the address?</h2>
            <div>
                <form onChange={handleChange}>
                    <Prompt when={isBlocking} message={() => "You have unsaved data. Press \"Cancel\" to keep your changes."} />
                    <input type="text" id="city" placeholder="City..." />
                    <br></br>
                    <input type="text" id="postalCode" placeholder="Zip..." />
                    <br></br>
                    <input type="text" id="streetName" placeholder="Street..." />
                    <br></br>
                    <input type="text" id="streetNumber" placeholder="Street number..." />
                    <br></br>
                    <input type="submit" value="Enter" onClick={handleSubmit} />
                </form>
            </div>
            {allServicePoints}
        </div>
    );
}

export function WeatherInfo({ weather }) {
    return (
        <div>
            <h2>Weather goes here</h2>
            <Log value={weather} />
        </div>
    )
}

export function FaceIt() {
    const [nickname, setNickname] = useState('');
    const [games, setGames] = useState([]);

    const [player, setPlayer] = useState({
        player: {
            games: {
                csgo: {
                    skill_level_label: "",
                    faceit_elo: ""
                }
            }
        },
        matches: {
            items: [{
                match_id: "",
                results: {
                    winner: "",
                },
                teams: {
                    faction1: {
                        nickname: "",
                        players: [{
                            nickname: "",
                            avatar: "",
                            skill_level: 0
                        }]
                    },
                    faction2: {
                        nickname: "",
                        players: [{
                            nickname: "",
                            avatar: "",
                            skill_level: 0
                        }]
                    }
                }
            }]
        }
    })

    const match = player.matches.items[0];
    const matchRoomLink = "https://www.faceit.com/en/csgo/room/" + match.match_id;
    const team1 = match.teams.faction1.players;
    const team2 = match.teams.faction2.players;
    

    useEffect(() => {
        apiFacade.getFaceItGames()
        .then(data => {
            const filtered = data.items.filter(game => game.long_label != "");
            setGames(filtered);
        });
    }, [])

    function handleSubmit(event) {
        event.preventDefault();
        apiFacade.getPlayerInfo(nickname)
        .then(data => {
            console.log(data);
            setPlayer(data);
        })
    }

    const gamesAsList = games.map((game) => 
        (
        <ul key={game.game_id}>
            <li>{game.long_label}</li>
            <img src={game.assets.featured_img_m} />
        </ul>
        )
    );

    return (
        <div>
            <div style={{paddingLeft: "2.5%", paddingTop: "1%"}}>
                <h2>FaceIt</h2>
                <p>
                    FaceIt er en platform som tilbyder spilserver, hubs, tournaments og andet til diverse videospil. Det er en 3rd party platform fra de originale spil, og er meget prominent
                    på diverse professionelle scener.<br/> Denne side vil primært fokusere på Counter Strike: Global Offensive men vil også vise hvilke andre spil som findes på platformen.
                </p>
                <ul>
                    <li>Bloom9900</li>
                    <li>-J_K_R-</li>
                    <li>Spantinho</li>
                    <li>HyperGD</li>
                    <li>jensen321</li>
                </ul>
                <p>Brug disse navne i input feltet herunder og derved vil mit backend hente diverse information om spilleren + deres seneste kamp.</p>

                <input placeholder="Type nickname here..." onChange={(event) => setNickname(event.target.value)} />
                <button type="submit" onClick={handleSubmit}>Search Player</button>
            </div>

            <div className="wrapper">
                <div className="one">
                    <br/>
                    <h3>Info for player: {player.player.nickname}</h3>
                    <h5>Cover Image:</h5>
                    <img style={{width: "100%"}} src={player.player.cover_image} />
                    <h5>Avatar:</h5>
                    <img src={player.player.avatar} />

                    <p>Player Level: {player.player.games.csgo.skill_level_label}</p>
                    <p>Player Elo: {player.player.games.csgo.faceit_elo}</p>
                    <p>Player ID: {player.player.player_id}</p>

                    <h3>Latest match:</h3>
                    <a href={matchRoomLink}>Link to matchroom</a>
                    <div className="wrapper">
                        <div className="one">
                            <h5>Team 1: {match.teams.faction1.nickname}</h5>
                            {team1.map(player => (
                                <div>
                                    <p>{player.nickname} level: {player.skill_level}</p>
                                    <img className="avatar" src={player.avatar}></img>
                                    <hr/>
                                </div>
                            ))}
                        </div>
                        <div className="twoSmall">
                            <h5>Team 2: {match.teams.faction2.nickname}</h5>
                            {team2.map(player => (
                                <div>
                                    <p>{player.nickname} level: {player.skill_level}</p>
                                    <img className="avatar" src={player.avatar}></img>
                                    <hr/>
                                </div>
                            ))}
                        </div>
                    </div>
                    

                </div>
                <div className="two">
                    {gamesAsList}
                </div>
            </div>
        
            
        </div>
    )
}

const Log = ({ value, replacer = null, space = 2 }) => (
    <pre>
        <code>{JSON.stringify(value, replacer, space)}</code>
    </pre>
)

export function NoMatch() {
    return (
        <div>
            <h2>Sorry, we couldn't find that page...</h2>
        </div>
    );
}