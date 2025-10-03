import requests

#	3rONYEi66Lpotk3Q
#   3NWzCE8vtfnIJAkQffEvlhP8rlUXQUmy

shipment = '3086567422'
url = "https://api-eu.dhl.com/track/shipments?trackingNumber=" + shipment

data = {
    "slug": "dhl",
    "tracking_number": shipment
}

headers = {
    "Content-Type": "application/json",
    "DHL-API-Key": "g2wbGku5ZnswWMJ0S36QAJPtK7uL9Igs"
}
    
response = requests.get(url, headers= headers)
print(url)
print(response.text)
