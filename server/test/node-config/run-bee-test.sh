docker run --name bee_test -v /home/pi/bee-test-data:/home/bee/.bee \
 -d \
 -p 1635:1635 \
 -p 1634:1634 \
 -p 1633:1633 \
 --rm -it ethersphere/bee:1.4.1 \
 start --welcome-message="Zoomerok - Short Videos Platform" \
 --swap-endpoint YOUR_XDAI_ENDPOINT_HERE \
 --cache-capacity=5000000 \
 --verbosity=5 \
 --debug-api-enable \
 --password="YOUR_STORAGE_PASSWORD_HERE"
