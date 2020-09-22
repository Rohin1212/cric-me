import React from "react";
import { Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import cricApi, { apiKey } from "../../api/cricApi";

import DynamicInput from "../../components/DynamicPlaceholder";
import Card, { CardHeader } from "../../components/Card";
import MatchCard from "../../components/MatchCard";
import { formatDate } from "../../utils";
import "./Home.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recentMatches: [],
      upcomingMatches: [],
    };
  }

  parseTeamScore = (score, teams) => {
    const scoreArray = score.split(" ");
    let prevEl = 0;
    const scoresForTeams = [];
    for (let i = 0; i < scoreArray.length; i++) {
      if (scoreArray[i].includes("/")) {
        if (prevEl === 0) {
          scoresForTeams.push(scoreArray.slice(i, i + 1).join(" "));
        } else {
          scoresForTeams.push(
            scoreArray.slice(i, i.length).find((el) => {
              return el.includes("/");
            })
          );
        }
        prevEl = i + 1;
        scoreArray.splice(scoreArray.indexOf("v"), 1);
      }
    }
    console.log(score);
    console.log(teams);
    console.log(scoresForTeams);
    return scoresForTeams;
  };

  fetchRecentMatchesScores = async () => {
    const data = this.state.recentMatches.map(async (match) => {
      if (match.matchStarted) {
        const response = await cricApi.get("/cricketScore", {
          params: {
            apikey: apiKey,
            unique_id: match.unique_id,
          },
        });
        return {
          ...match,
          stat: response.data.stat,
          score: response.data.score,
        };
      }
      return match;
    });
    const dataWithPromiseResolved = await Promise.all(data);
    this.setState({ recentMatches: dataWithPromiseResolved });
    console.log(dataWithPromiseResolved);
  };
  fetchRecentMatches = async () => {
    const response = await cricApi.get("/matches", {
      params: { apikey: apiKey },
    });
    const upcomingMatches = [];
    const recentMatches = response.data.matches.filter((match) => {
      if (match.matchStarted) {
        return match;
      }
      upcomingMatches.push(match);
    });

    this.setState({ recentMatches: recentMatches });
    this.setState({ upcomingMatches: upcomingMatches });
    this.fetchRecentMatchesScores();
  };
  renderRecentMatches = () => {
    return this.state.recentMatches.map((match) => {
      const scores = match.stat
        ? this.parseTeamScore(match.score, [match["team-1"], match["team-2"]])
        : ["", ""];
      return (
        <div className="shadow-dark w-100 mb-1">
          <MatchCard
            isDone={match.matchStarted}
            location="Stadium, Location"
            team1={{
              name: match["team-1"],
              score: match.matchStarted && match.stat ? scores[0] : "",
            }}
            team2={{
              name: match["team-2"],
              score: match.matchStarted && match.stat ? scores[1] : "",
            }}
            matchFooter={match.stat === "" ? "" : match.stat}
            key={match.unique_id}
          />
        </div>
      );
    });
  };

  renderUpcomingMatches = () => {
    return this.state.upcomingMatches.filter((match,index)=>index < 3).map((match,index) => {
      if(index){

      }
      return (
        <div className="shadow-dark w-100 mb-1">
          <MatchCard
            isDone={false}
            location="Stadium, Location"
            team1={{
              name: match["team-1"],
            }}
            team2={{
              name: match["team-2"],
            }}
            matchFooter={formatDate(match.date)}
            key={match.unique_id}
          />
        </div>
      );
    });
  };

  componentDidMount() {
    this.fetchRecentMatches();
  }
  render() {
    return (
      <div className="container d-flex align-items-center justify-content-center flex-column">
        <div className="w-100 d-flex align-items-center justify-content-center">
          <Card
            className="text-center mt-2 rounded"
            bodyClassName="d-flex flex-column align-items-center justify-content-center"
          >
            <h2>Which Player Do you Want to look at?</h2>
            <InputGroup className="mb-3" id="search-bar">
              <InputGroup.Prepend>
                <InputGroup.Text id="player-name">
                  <FontAwesomeIcon icon={faSearch} />{" "}
                </InputGroup.Text>
              </InputGroup.Prepend>
              <DynamicInput
                className="bg-primary form-control"
                options={["Dhoni", "Sachin", "Kohli", "Pant"]}
              />
            </InputGroup>
            <div className="search-bar-btns">
              {" "}
              <Button className="mr-3">Search Player</Button>
              <Button>Get a random player</Button>
            </div>
          </Card>
        </div>

        <div className="w-100 d-flex align-items-center justify-content-center my-2">
          <Card className="rounded">
            <h3>Fact For today</h3>
            <p>
              In 1997 Women’s world cup, Belinda Clark hit a double ton and made
              unbeaten 229 against Denmark.
            </p>
            <Button className="mr-3">Get Another Fact</Button>
          </Card>
        </div>
        <div className="w-100 d-flex align-items-center justify-content-center mt-1 flex-column">
          <CardHeader className=" rounded-top card-header w-80">
            <p className="mb-0 font-weight-bold">Results Of Matches</p>
          </CardHeader>
          {this.renderRecentMatches()}
          <Button className="my-2">View More</Button>
        </div>
        <div className="w-100 d-flex align-items-center justify-content-center mt-2 flex-column">
          <CardHeader className=" rounded-top card-header w-80">
            <p className="mb-0 font-weight-bold">Upcoming</p>
          </CardHeader>
          {this.renderUpcomingMatches()}
          <Button className="my-2">View More</Button>
        </div>
      </div>
    );
  }
}
export default Home;

/* <MatchCard
            isDone
            location="Stadium, Location"
            team1={{ name: "team1", score: "192/8" }}
            team2={{ name: "team2", score: "192/8" }}
            matchFooter="Team won by 8 wickets"
          />
          <MatchCard
            isDone
            location=""
            team1={{ name: "", score: "" }}
            team2={{ name: "", score: "" }}
            matchFooter=""
          /> */
