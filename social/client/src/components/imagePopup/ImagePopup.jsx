
import PropTypes from 'prop-types';

export default function ImagePopup(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <img src={props.src} onClose={handleClose} open={open} alt=""/>
);
}
ImagePopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
