module.exports = function(str) {
    return function(d){ return str ? d[str] : d }
}
