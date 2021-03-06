import React from "react";
import PropTypes from "prop-types";

class ReactGoogleSearchBox extends React.Component {
  static propTypes = {
    onPlaceSelected: PropTypes.func,
    types: PropTypes.array,
    componentRestrictions: PropTypes.object,
    bounds: PropTypes.object,
    fields: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.event = null;
  }

  componentDidMount() {
    const {
      types = ["(cities)"],
      componentRestrictions,
      bounds,
      fields = [
        "address_components",
        "geometry.location",
        "place_id",
        "formatted_address",
      ],
    } = this.props;
    const config = {
      types,
      bounds,
      fields,
    };

    if (componentRestrictions) {
      config.componentRestrictions = componentRestrictions;
    }

    this.disableAutofill();

    this.autocomplete = new this.props.google.maps.places.SearchBox(
      this.refs.input,
      config
    );

    this.event = this.autocomplete.addListener(
      "places_changed",
      this.onSelected.bind(this)
    );
  }

  disableAutofill() {
    // Autofill workaround adapted from https://stackoverflow.com/questions/29931712/chrome-autofill-covers-autocomplete-for-google-maps-api-v3/49161445#49161445
    if (window.MutationObserver) {
      const observerHack = new MutationObserver(() => {
        observerHack.disconnect();
        if (this.refs && this.refs.input) {
          this.refs.input.autocomplete = "disable-autofill";
        }
      });
      observerHack.observe(this.refs.input, {
        attributes: true,
        attributeFilter: ["autocomplete"],
      });
    }
  }

  componentWillUnmount() {
    if (this.event) this.event.remove();
  }

  onSelected() {
    if (this.props.onPlaceSelected && this.autocomplete) {
      this.props.onPlaceSelected(
        this.autocomplete.getPlaces(),
        this.refs.input
      );
    }
  }

  render() {
    const {
      onPlaceSelected,
      types,
      componentRestrictions,
      bounds,
      ...rest
    } = this.props;

    return <input ref="input" {...rest} />;
  }
}

export default ReactGoogleSearchBox;
