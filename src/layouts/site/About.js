import React, { Component } from "react";
import Jumbotron from "../../components/site/Jumbotron";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Jumbotron title="About" subtitle="We don't trade your information!" />
        <div className="container">
          <h2>About</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Eros in
            cursus turpis massa tincidunt dui ut. Tellus cras adipiscing enim
            eu. Amet tellus cras adipiscing enim eu turpis. Id consectetur purus
            ut faucibus pulvinar elementum integer. Lectus sit amet est placerat
            in egestas erat imperdiet sed. Felis bibendum ut tristique et
            egestas quis ipsum. Ornare arcu odio ut sem nulla pharetra. Nisl
            pretium fusce id velit ut tortor pretium viverra. In massa tempor
            nec feugiat. Turpis massa tincidunt dui ut ornare lectus sit amet.
            Sagittis purus sit amet volutpat consequat mauris nunc congue. Neque
            egestas congue quisque egestas diam in arcu cursus euismod. Facilisi
            cras fermentum odio eu feugiat pretium. Nulla facilisi etiam
            dignissim diam quis enim lobortis scelerisque fermentum. Pretium
            aenean pharetra magna ac placerat vestibulum lectus.
          </p>
          <p>
            Faucibus turpis in eu mi bibendum neque. Mattis aliquam faucibus
            purus in massa tempor nec feugiat. Faucibus scelerisque eleifend
            donec pretium vulputate sapien nec sagittis. Viverra nam libero
            justo laoreet. Diam ut venenatis tellus in metus vulputate eu
            scelerisque. Tincidunt dui ut ornare lectus sit amet est. Odio
            aenean sed adipiscing diam. Mauris pellentesque pulvinar
            pellentesque habitant. Posuere morbi leo urna molestie at elementum.
            Pharetra magna ac placerat vestibulum lectus mauris ultrices eros
            in. Nullam vehicula ipsum a arcu. Turpis egestas sed tempus urna.
            Vivamus at augue eget arcu dictum varius duis at.
          </p>
        </div>
      </div>
    );
  }
}

export default About;
