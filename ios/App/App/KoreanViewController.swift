import Capacitor

final class KoreanViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(KoSpeechPlugin())
        bridge?.registerPluginInstance(KoTutorPlugin())
    }
}
