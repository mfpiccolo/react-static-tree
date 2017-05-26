import React from 'react';
import PropTypes from 'prop-types';

import Divider from 'material-ui/Divider';

const CourseTitleCard = props => {
  return (
    <div style={{width: '100%'}}>
      <h1 style={{width: '100%'}}>{props.title}</h1>
      <div style={styles.subHeading}>
        <div style={styles.subHeadingLeft}>
          <span
            style={styles.subTitleEach}
          >{`${props.subTitleCredits} Credits`}</span>
          <span style={styles.subTitleEach}>
            {props.subTitleCategoryCourses}
          </span>
        </div>
        <div style={styles.subHeadingRight}>
          {`$${props.price}`}
        </div>
      </div>
      <Divider />
    </div>
  );
};

CourseTitleCard.propTypes = {
  price: PropTypes.string.isRequired,
  subTitleCategoryCourses: PropTypes.string.isRequired,
  subTitleCredits: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const styles = {
  subHeading: {
    width: '100%',
    display: 'flex',
    padding: '10px 0',
  },
  subHeadingLeft: {
    width: '70%',
  },
  subTitleEach: {
    paddingRight: '40px',
  },
  subHeadingRight: {
    width: '30%',
    textAlign: 'right',
  },
};

export default CourseTitleCard;
