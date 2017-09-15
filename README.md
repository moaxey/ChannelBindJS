ChannelBindJS
=============

Activates elements for inline editing and live updating from a django-channels
backend. This script looks for expected class names and data attributes and 
adds events and attributes to connect them.

The aim of this script is to be small and easy to use rather than being 
high-performance of highly featured. Compatibility is for modern browsers.

Any html element containing a representation of a django model can be activated
by adding classes to it and its enclosed field values.

On the container:
- class="live"
- data-model="appname.modelname"
- data-id="1" // primay key

On each field:
- class="field" // to enable live udpates
- class="editable" // to enable inline editing
- data-field="fieldname"

This object depends on the channels.WebSocketBinding and should be initialised
with the binding url of the demultiplexer set up in channels routing.

> <script src="/static/channels/js/websocketbridge.js"></script>
> <script src="/static/mm/js/activate.js"</script>
> <script>Activation.init('/binding/');</script>


Links
-----

[Channels data binding documentation](https://channels.readthedocs.io/en/stable/binding.html)
