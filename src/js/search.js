import airports from './airport-data'

module.exports = {

  // Perform a search for an Origin or Destination airport.
  performAirportSearch: function (self, event) {
    var searchTerm = event.srcElement.value
    var inputId = event.srcElement.id
    var searchResultsArray = this.getNameOfSearchResultsArray(inputId)

    // Ensure that search is considered inactive.
    self.searchIsActive = undefined
    self.activeSearch = inputId

    // Ensure no airport is selected for the search.
    self[inputId] = undefined

    if (searchTerm.length < 2) {
      self[searchResultsArray] = []
      return
    }

    // Debounce this search event.
    if (self.searchTimeout) clearInterval(self.searchTimeout)

    // Find matching airports for the search term.
    var innerSelf = this
    self.searchTimeout = setTimeout(function () {
      self[searchResultsArray] =
        innerSelf.findMatchingAirports(self, searchTerm, inputId)
    }, 200)
  },

  findMatchingAirports: function (self, searchTerm, inputId) {
    // Empty array to hold results of matching airports.
    var matchingAirports = []
    // Keep reference to module context.
    var innerSelf = this
    // Make sure search term is lowercase.
    searchTerm = searchTerm.toLowerCase()
    // Iterate over all known US airports. Check to see if the search term
    // exists within city name, name of Airport, airport code or state name.
    airports.getData().forEach(function (item) {
      // If the search term is a valid Airport code, behave as if they selected
      // this airport already.  That way, if they abandon search with an
      // offclick, the expected behavior will occur.
      if (innerSelf.isValidCode(item, searchTerm)) self[inputId] = item
      if (innerSelf.nameMatch(item, searchTerm) ||
          innerSelf.cityMatch(item, searchTerm) ||
          innerSelf.codeMatch(item, searchTerm) ||
          innerSelf.stateMatch(item, searchTerm)) {
        matchingAirports.push(item)
      }
    })

    // Note that search is active, which will help us notify user if their
    // search has not produced any results.
    self.searchIsActive = true

    // Return a list of possible matches.
    return matchingAirports
  },

  // Clear the array of search results, which will have the side effect
  // of removing search autocomplete components in the UI.
  clearSearch: function (self, event) {
    var inputId = event.srcElement.id
    var searchResultsArray = this.getNameOfSearchResultsArray(inputId)
    setTimeout(function () {
      self[searchResultsArray] = []
      self.searchIsActive = undefined
    }, 300)
  },

  // Get the name of the array where search results are being held.
  getNameOfSearchResultsArray: function (inputId) {
    return inputId + 'SearchResults'
  },

  /*
   * Methods to determine if search term matches a param on an Airport
   * object.
   *
   */
  isValidCode: function (item, searchTerm) {
    return item.code.toLowerCase() === searchTerm
  },

  nameMatch: function (item, searchTerm) {
    return this.testMatch('name', item, searchTerm)
  },

  cityMatch: function (item, searchTerm) {
    return this.testMatch('city', item, searchTerm)
  },

  stateMatch: function (item, searchTerm) {
    return this.testMatch('state', item, searchTerm)
  },

  codeMatch: function (item, searchTerm) {
    return this.testMatch('code', item, searchTerm)
  },

  testMatch: function (param, item, searchTerm) {
    return item[param].toLowerCase().search(searchTerm) !== -1
  }
}
