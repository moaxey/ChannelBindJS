var Activation = (function () {
    var verification,
        live_elements,
        update_tid,
        update_delay = 400,
        streams_model_map = {},
        dataBridge = new channels.WebSocketBridge();

    function verify(stream, pk) {
        if ((typeof verification !== 'undefined') &&
            (verification[1] === stream) &&
            (verification[2] == pk)) {
            window.clearTimeout(verification[0]);
            verification = (function () { return; })();
        }
    }

    function set_verification(stream, pk, repeat_function, event) {
        verification = [
            window.setTimeout(function() {
                repeat_function(event);
            }, 1000),
            stream,
            pk,
        ];
    }

    function updater(action, stream) {
        var element, fields, field,
            data_keys = Object.keys(action.data),
            targets = streams_model_map[stream][action.model][action.pk];
        if (action.action === 'update') {
            // clear verification if it anticipates this update
            verify(stream, action.pk);
            for (var inc=0; inc < targets.length; inc += 1) {
                fields = targets[inc].getElementsByClassName('field');
                for (var inc2=0; inc2 < fields.length; inc2 += 1) {
                    field = fields[inc2].getAttribute('data-field');
                    if (data_keys.indexOf(field) >= 0) {
                        if (fields[inc2].innerHTML !== action.data[field]) {
                            fields[inc2].innerHTML = action.data[field];
                        }
                    }
                }
            }
        }
    }

    function setup_listener(bind) {
        var streams = Object.keys(streams_model_map);
        dataBridge.connect(bind);
        dataBridge.listen(streams);
        for (var inc=0; inc < streams.length; inc += 1) {
            dataBridge.demultiplex(streams[inc], updater);
        }
    }

    function index_document() {
        var dmod, did, dstrm;
        live_elements = document.getElementsByClassName('live');
        for (var inc=0; inc < live_elements.length; inc += 1) {
            // keep a list of the streams to demultiplex
            dstrm = live_elements[inc].attributes['data-stream'].value;
            if (!streams_model_map.hasOwnProperty(dstrm)) {
                streams_model_map[dstrm] = {};
            }
            // map model and id to DOM
            dmod = live_elements[inc].attributes['data-model'].value;
            if (!streams_model_map[dstrm].hasOwnProperty(dmod)) {
                streams_model_map[dstrm][dmod] = {};
            }
            did = live_elements[inc].attributes['data-id'].value;
            if (!streams_model_map[dstrm][dmod].hasOwnProperty(did)) {
                streams_model_map[dstrm][dmod][did] = [];
            }
            streams_model_map[dstrm][dmod][did].push(live_elements[inc]);
        }
    }

    function live_input(event) {
        var live_el, field, update_data = {};
        // ascend from target to containing element with class live
        // to read stream and primary key
        live_el = event.target.parentNode;
        while(!live_el.classList.contains('live')) {
            live_el = live_el.parentNode;
        }
        // clear verification process if it is for this field
        verify(
            live_el.getAttribute('data-stream'),
            live_el.getAttribute('data-id')
        );
        field = event.target.getAttribute('data-field');
        // send event after a second of inactivity...
        if (update_tid >= 0) {
            window.clearTimeout(update_tid);
        }
        update_data[field] = event.target.innerText.trim();
        update_tid = window.setTimeout(function() {
            dataBridge.stream(live_el.getAttribute('data-stream')).send(
                {
                    action: 'update',
                    pk: live_el.getAttribute('data-id'),
                    data: update_data
                }
            );
            // verifying that updates return from server as channel messages
            // may not all be delivered.
            set_verification(
                live_el.getAttribute('data-stream'),
                live_el.getAttribute('data-id'),
                live_input,
                event
            );
        }, 1000);
    }

    function setup_editing() {
        var fields_editable;
        // select .field.editable elements inside .live containers
        for (var inc=0; inc < live_elements.length; inc += 1) {
            fields_editable = live_elements[inc].getElementsByClassName(
                'editable'
            );
            for (var inc2=0; inc2 < fields_editable.length; inc2 += 1) {
                fields_editable[inc2].style.position="relative";
                fields_editable[inc2].style.zIndex="2";
                fields_editable[inc2].setAttribute("contenteditable", true);
                fields_editable[inc2].addEventListener("input", live_input);
            }
        }
    }

    function init(bind) {
        index_document();
        setup_listener(bind);
        setup_editing();
    }

    return {
        init: init
    };
}());
