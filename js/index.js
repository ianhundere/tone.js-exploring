var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
console.clear();
var Instrument = (function() {
    function Instrument() {
        _classCallCheck(this, Instrument);
        this.synth = null;
        this.gain = new Tone.Gain(0.7);
        this.gain.toMaster();
        this.tick = 0;
        this.initializeTransport();
    }
    _createClass(Instrument, [
        {
            key: 'initializeTransport',
            value: function initializeTransport() {
                var _this = this;
                var notes = 'CDEFGAB'.split('').map(function(n) {
                    return n + '4';
                });
                Tone.Transport.scheduleRepeat(function(time) {
                    var note = notes[(_this.tick * 2) % notes.length];
                    if (_this.synth)
                        _this.synth.triggerAttackRelease(note, '8n', time);
                    _this.tick++;
                }, '4n');
            }
        },
        {
            key: 'toggle',
            value: function toggle() {
                this.playing = !this.playing;
                if (this.playing) Tone.Transport.start();
                else Tone.Transport.stop();
            }
        },
        {
            key: 'update',
            value: function update(
                synthType,
                oscillatorType,
                oscillatorPartials,
                envelope
            ) {
                this._updateSynthType(synthType, envelope);
                this._updateOscillatorType(oscillatorType, oscillatorPartials);
            }
        },
        {
            key: '_updateSynthType',
            value: function _updateSynthType(synthType, envelope) {
                // If we have already defined the synth
                if (this.synth) {
                    this.synth.disconnect(this.gain);
                    this.synth.dispose();
                }
                // The new Synth!
                var settings = this.defaultSettings[synthType] || {};
                settings.envelope = Object.assign(settings.envelope, envelope);
                this.synth = new Tone[synthType](settings);
                this.synth.connect(this.gain);
            }
        },
        {
            key: '_updateOscillatorType',
            value: function _updateOscillatorType(
                oscillatorType,
                oscillatorPartials
            ) {
                var partials =
                    oscillatorPartials === 'none' ? '' : oscillatorPartials;
                this.synth.oscillator.type = '' + oscillatorType + partials;
            }
        },
        {
            key: 'defaultSettings',
            get: function get() {
                return {
                    Synth: {
                        oscillator: { type: 'triangle' },
                        envelope: {
                            attack: 0.005,
                            decay: 0.1,
                            sustain: 0.3,
                            release: 1
                        }
                    },

                    AMSynth: {
                        harmonicity: 3,
                        detune: 0,
                        oscillator: {
                            type: 'sine'
                        },

                        envelope: {
                            attack: 0.01,
                            decay: 0.01,
                            sustain: 1,
                            release: 0.5
                        },

                        modulation: {
                            type: 'square'
                        },

                        modulationEnvelope: {
                            attack: 0.5,
                            decay: 0,
                            sustain: 1,
                            release: 0.5
                        }
                    },

                    FMSynth: {
                        harmonicity: 3,
                        modulationIndex: 10,
                        detune: 0,
                        oscillator: {
                            type: 'sine'
                        },

                        envelope: {
                            attack: 0.01,
                            decay: 0.01,
                            sustain: 1,
                            release: 0.5
                        },

                        modulation: {
                            type: 'square'
                        },

                        modulationEnvelope: {
                            attack: 0.5,
                            decay: 0,
                            sustain: 1,
                            release: 0.5
                        }
                    }
                };
            }
        }
    ]);
    return Instrument;
})();

var $synthType = document.querySelector('#synth-type');
var $oscillatorType = document.querySelector('#oscillator-type');
var $oscillatorPartials = document.querySelector('#oscillator-partials');
var $toggle = document.querySelector('#toggle');
var $envelopeAttack = document.querySelector('#envelope-attack');
var $envelopeDecay = document.querySelector('#envelope-decay');
var $envelopeSustain = document.querySelector('#envelope-sustain');
var $envelopeRelease = document.querySelector('#envelope-release');
var inst = new Instrument();

var steps = [0, 0.001, 0.005, 0.01, 0.05, 0.1, 0.125, 0.25, 0.5, 0.75, 1];

$envelopeAttack.addEventListener('change', update);
$envelopeDecay.addEventListener('change', update);
$envelopeSustain.addEventListener('change', update);
$envelopeRelease.addEventListener('change', update);

$toggle.addEventListener('click', function(e) {
    inst.toggle();
    if ($toggle.className.match('is-success')) {
        $toggle.classList.remove('is-success');
        $toggle.classList.add('is-danger');
    } else {
        $toggle.classList.add('is-success');
        $toggle.classList.remove('is-danger');
    }
    $toggle.classList.toggle('active');
});

update();

$synthType.addEventListener('change', update);
$oscillatorType.addEventListener('change', update);
$oscillatorPartials.addEventListener('change', update);

function update() {
    var envelope = {
        attack: steps[parseInt($envelopeAttack.value)],
        decay: steps[parseInt($envelopeDecay.value)],
        sustain: steps[parseInt($envelopeSustain.value)],
        release: steps[parseInt($envelopeRelease.value)]
    };

    document.querySelector('label[for="envelope-attack"] span').innerText =
        envelope.attack;
    document.querySelector('label[for="envelope-decay"] span').innerText =
        envelope.decay;
    document.querySelector('label[for="envelope-sustain"] span').innerText =
        envelope.sustain;
    document.querySelector('label[for="envelope-release"] span').innerText =
        envelope.release;
    inst.update(
        $synthType.value,
        $oscillatorType.value,
        $oscillatorPartials.value,
        envelope
    );
}
