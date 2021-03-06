import React from "react";

import Card from "../Card";
import "./Placeholder.css";

const PlaceholderPlayerCard = () => {
  return (
    <Card>
      <div class="ui placeholder " style={{ maxWidth: "100%" }}>
        <div class="image header">
          <div class="line"></div>
        </div>
      </div>
    </Card>
  );
};

export default PlaceholderPlayerCard;
