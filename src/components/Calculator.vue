<template>
  <div class="sample">

    <h1>{{ pageTitle }}</h1>
    <h3>{{ pageSubTitle}}</h3>

    <!-- Begin Search Component -->
    <div class="search-wrapper">
      <span>
        <label v-bind:for="originAirportString" class="input-label">{{ originAirportLabel }}</label>
        <input v-on:keyup="performAirportSearch" v-on:blur="clearSearch" type="text" v-bind:id="originAirportString" placeholder="Search">
        <p v-bind:id="originAirportString + 'SearchResults'" class="search-result-list">
          <label v-for="item in originAirportSearchResults" v-on:click="selectAirport" v-bind:id="'selected-' + originAirportString" v-bind:data-for="JSON.stringify(item)" class="search-result-list-item">
            {{ item.code }} ({{ item.city }})
            <em>{{ item.name }}</em>
          </label>
          <label class="search-result-list-item" v-show="originAirportSearchResults.length == 0 && searchIsActive && activeSearch == originAirportString">{{ noResultsMessage }}</label>
        </p>
      </span>

      <label class="flight-arrow">&#8674</label>

      <span>
        <label v-bind:for="destinationAirportString" class="input-label">{{ destinationAirportLabel }}</label>
        <input v-on:keyup="performAirportSearch" v-on:blur="clearSearch" type="text" v-bind:id="destinationAirportString" placeholder="Search">
        <p v-bind:id="destinationAirportString + 'SearchResults'" class="search-result-list">
          <label v-for="item in destinationAirportSearchResults" v-on:click="selectAirport" v-bind:id="'selected-' + destinationAirportString" v-bind:data-for="JSON.stringify(item)" class="search-result-list-item">
            {{ item.code }} ({{ item.city }})
            <em>{{ item.name }}</em>
          </label>
          <label class="search-result-list-item" v-show="destinationAirportSearchResults.length == 0 && searchIsActive && activeSearch == destinationAirportString">{{ noResultsMessage }}</label>
        </p>
      </span>
      <p class="no-search-message" v-show="!originAirport || !destinationAirport">{{ noSearchMessage }}</p>
    </div>
    <!-- End Search Component -->

    <!-- Begin Search Results Component -->
    <div class="search-results-message">
      <button class="no-search-button search-message" v-on:click="showMileageMessage" v-show="originAirport && destinationAirport && showButton">{{ buttonText }}</button>
      <p class="success-search-message search-message" v-show="originAirport && destinationAirport && showMessage">{{ mileageMessage }}</p>
    </div>
    <!-- End Search Results Component -->

    <!-- Map Component -->
    <div class="map" id="map" v-show="originAirport && destinationAirport && showMessage"></div>

  </div>
</template>

<script>
  import searchUtils from '../js/search'
  import distanceUtils from '../js/distance'
  import mapUtils from '../js/map'

  export default {
    data () {
      return {

        // Holders for search results.
        originAirportSearchResults: [],
        destinationAirportSearchResults: [],
        searchIsActive: undefined,
        activeSearch: undefined,
        originAirportString: 'originAirport',
        destinationAirportString: 'destinationAirport',

        // Holders for selected airports.
        originAirport: undefined,
        destinationAirport: undefined,
        showMessage: undefined,
        showButton: true,

        // Copy for page.
        pageTitle: 'Flight Mileage Calculator',
        originAirportLabel: 'Origin Airport',
        destinationAirportLabel: 'Destination Airport',
        pageSubTitle: 'Calculate the distance between two US Airports in nautical miles',
        noSearchMessage: 'Please select an Origin and Destination airport to calculate mileage',
        noResultsMessage: 'No results found for search term',
        buttonText: '',
        mileageMessage: ''
      }
    },

    watch: {
      originAirport: function (val) {
        if (!val || !this.destinationAirport) return
        this.updateMileageMessage(val, this.destinationAirport)
      },
      destinationAirport: function (val) {
        if (!val || !this.originAirport) return
        this.updateMileageMessage(this.originAirport, val)
      }
    },

    methods: {

      // Clear search from input. Delay action in order to allow click
      // function to fire
      clearSearch: function (e) {
        searchUtils.clearSearch(this, e)
      },

      selectAirport: function (e) {
        var airport = e.srcElement.id.replace('selected-', '')
        this[airport] = JSON.parse(e.srcElement.dataset.for)
        document.getElementById(airport).value = this[airport].code
      },

      performAirportSearch: function (e) {
        this.hideMileageMessage()
        searchUtils.performAirportSearch(this, e)
      },

      showMileageMessage: function () {
        this.showMessage = true
        this.showButton = false
        mapUtils.createMap(this)
        mapUtils.setPolylineToMap(this)
      },

      hideMileageMessage: function () {
        this.showMessage = false
        this.showButton = true
      },

      updateMileageMessage: function (orig, dest) {
        // Get the distance measurement.
        var distance = distanceUtils.getDistanceFromLatLonInKm(
                         orig.lat, orig.lon, dest.lat, dest.lon)

        // Create the messages needed for the UI.
        this.mileageMessage = this.createMileageMessage(orig, dest, distance)
        this.buttonText = this.createButtonText(orig, dest)
      },

      createMileageMessage: function (orig, dest, distance) {
        return 'The distance between ' + orig.code + ' (' + orig.name + ')' +
               ' and ' + dest.code + ' (' + dest.name + ') is ' +
               distance + ' miles'
      },

      createButtonText: function (orig, dest) {
        return 'Click to see the mileage between ' + orig.code +
               ' and ' + dest.code
      }
    }
  }
</script>

<style lang="sass" scoped>

  $mobile-break: 400px
  $desktop-width: 600px
  $mobile-width: 90%
  $gray: #d8d5d5
  $sans-serif-font: "Arial", sans-serif
  $serif-font: "Playfair Display", serif

  .width-rule
    width: $desktop-width
    @media screen and (max-width: $mobile-break)
      width: $mobile-width

  .standard-font-sm
    font-family: $sans-serif-font
    font-size: 12px
    font-weight: normal

  .standard-font-md
    font-family: $sans-serif-font
    font-size: 14px
    font-weight: normal

  h1
    font-family: $serif-font
    font-weight: bold
    text-align: center
    color: rgb(70, 68, 68)

  h3
    @extend .standard-font-md
    color: $gray

  h1,
  h3
    text-align: center
    margin: 12px auto
    @extend .width-rule

  .search-result-list
    display: block
    position: absolute
    margin: 0
    padding-right: 2px
    padding-bottom: 2px
    max-height: 200px
    overflow-x: scroll

  .no-search-button
    background: #f7e974
    color: #bda852
    cursor: pointer

  .no-search-message
    @extend .standard-font-sm
    color: $gray
    margin-top: 12px

  .success-search-message
    background: #82e8b2
    color: #38795f

  .search-message
    display: block
    text-align: center
    font-family: $serif-font
    font-size: 18px
    margin: 0 auto
    padding: 12px
    border-radius: 3px
    border: 1px solid
    -webkit-appearance: none
    @extend .width-rule

  .search-result-list-item
    @extend .standard-font-sm
    display: block
    text-align: left
    background: white
    margin-left: 14px
    padding: 6px 6px
    width: 177px
    color: #708fdc
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.24)
    @media screen and (max-width: $mobile-break)
      margin-left: 28px
    &:hover
      background: #f9f8f8
      cursor: pointer
    em
      pointer-events: none
      display: block
      color: $gray
      font-style: normal
      margin-top: 1px

  .search-wrapper
    display: block
    margin: 32px auto
    text-align: center
    padding: 32px
    padding-bottom: 12px
    background: #fbfbfb
    border: 1px solid #f1f1f1
    border-radius: 1px
    @extend .width-rule
    @media screen and (max-width: $mobile-break)
      padding: 32px 0

    .flight-arrow
      margin-top: 24px
      display: inline-block

    span
      display: inline-block
      width: 200px
      vertical-align: top
      @media screen and (max-width: $mobile-break)
        display: block
        width: 100%
        margin-bottom: 24px

      .input-label
        @extend .standard-font-sm
        color: $gray
        padding-bottom: 4px

      input
        padding: 8px 5px
        font-size: 14px
        outline: none
        @media screen and (max-width: $mobile-break)
          border: 1px solid rgba(0, 0, 0, 0.18)

      .input-label,
      input
        display: block
        text-align: left
        margin: 0 auto
        width: 80%

      span
        display: block
      .flight-arrow
        display: none
  #map
    display: block
    margin: 24px auto
    height: 200px
    @extend .width-rule
</style>
