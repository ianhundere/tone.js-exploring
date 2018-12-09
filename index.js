require(["Tone"], function (Tone) {

    var synth = new Tone.MonoSynth().toMaster();

//schedule a series of notes, one per second
synth.triggerAttackRelease('C4', 0.5, 0);
synth.triggerAttackRelease('E4', 0.5, 1);
synth.triggerAttackRelease('G4', 0.5, 2);
synth.triggerAttackRelease('B4', 0.5, 3);
