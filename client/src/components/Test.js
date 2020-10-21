import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Draggable from 'react-draggable';

// export class Test extends React.Component {
//     state = {
//       activeDrags: 0,
//       controlledPosition: {
//         x: -400, y: 200
//       }
//     };
//     onStart = () => {
//       this.setState({activeDrags: ++this.state.activeDrags});
//     };
  
//     onStop = () => {
//       this.setState({activeDrags: --this.state.activeDrags});
//     };
  
//     // For controlled component
//     adjustXPos = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       const {x, y} = this.state.controlledPosition;
//       this.setState({controlledPosition: {x: x - 10, y}});
//     };
  
//     adjustYPos = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       const {controlledPosition} = this.state;
//       const {x, y} = controlledPosition;
//       this.setState({controlledPosition: {x, y: y - 10}});
//     };
  
//     onControlledDrag = (e, position) => {
//       const {x, y} = position;
//       this.setState({controlledPosition: {x, y}});
//     };
  
//     onControlledDragStop = (e, position) => {
//       this.onControlledDrag(e, position);
//       this.onStop();
//     };
  
//     render() {
//       const {controlledPosition} = this.state;
//       return (
//         <div>
//           <Draggable position={controlledPosition} onStop={this.onControlledDragStop}>
//             <div className="box">
//               My position can be changed programmatically. <br />
//               I have a dragStop handler to sync state.
//               <div>
//                 <a href="#" onClick={this.adjustXPos}>Adjust x ({controlledPosition.x})</a>
//               </div>
//               <div>
//                 <a href="#" onClick={this.adjustYPos}>Adjust y ({controlledPosition.y})</a>
//               </div>
//             </div>
//           </Draggable>
  
//         </div>
//       );
//     }
//   }
  

  export const Test = () => {
    const [activeDrags, setActiveDrags] = useState(0)
    const [controlledPosition, setControlledPosition] = useState({
        x: -400, y: 200
      })
    
    const onStart = () => {
    //   this.setState({activeDrags: ++this.state.activeDrags});
      setActiveDrags(prev => ++prev)
    };
  
    const onStop = () => {
    //   this.setState({activeDrags: --this.state.activeDrags});
      setActiveDrags(prev => --prev)
    };
  
    // For controlled component
    const adjustXPos = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const {x, y} = controlledPosition;
    //   this.setState({controlledPosition: {x: x - 10, y}});
      setControlledPosition({x: x - 10, y})
    };
  
    const adjustYPos = (e) => {
      e.preventDefault();
      e.stopPropagation();
    //   const {controlledPosition} = this.state;
      const {x, y} = controlledPosition;
    //   this.setState({controlledPosition: {x, y: y - 10}});
      setControlledPosition( {x, y: y - 10})
    };
  
    const onControlledDrag = (e, position) => {
      const {x, y} = position;
    //   this.setState({controlledPosition: {x, y}});
      setControlledPosition( {x, y})
    };
  
    const onControlledDragStop = (e, position) => {
      onControlledDrag(e, position);
      onStop();
    };
    return (
        <div>
          <Draggable 
          position={controlledPosition} 
          onStop={onControlledDragStop}>
            <div className="box">
              My position can be changed programmatically. <br />
              I have a dragStop handler to sync state.
              <div>
                <a href="#" onClick={adjustXPos}>Adjust x ({controlledPosition.x})</a>
              </div>
              <div>
                <a href="#" onClick={adjustYPos}>Adjust y ({controlledPosition.y})</a>
              </div>
            </div>
          </Draggable>
  
        </div>
    )
}