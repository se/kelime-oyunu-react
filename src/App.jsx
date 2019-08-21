import React, { useState, useEffect } from "react";
import HarfView from "./HarfView";

export default () => {
  const [puanToplam, setPuanToplam] = useState(0);
  const [mesaj, setMesaj] = useState(null);
  const [sure, setSure] = useState(null);
  const [oyun, setOyun] = useState({
    mevcutSoru: null,
    sorular: [
      {
        soru: "Siyah ile aynı anlama gelen bir renk.",
        cevap: "KARA",
        soruldu: false
      },
      {
        soru: "Sık kullanılan bir isim.",
        cevap: "AHMET",
        soruldu: false
      },
      {
        soru: "Türkiye'nin başkenti",
        cevap: "ANKARA",
        soruldu: false
      },
      {
        soru: "Karadenizde bir ilimiz",
        cevap: "TRABZON",
        soruldu: false
      },
      {
        soru:
          "Kayısısı ile ünlü olan ilimiz? (İpucu: Peki bundan ...'nın haberi var mı?)",
        cevap: "MALATYA",
        soruldu: false
      }
    ],
    harfler: [],
    puanToplam: 0,
    puanHarf: 0,
    tamamlandi: false,
    yarismaciCevap: ""
  });

  const mesajver = (mesaj, tur) => {
    if (tur === "hata") {
      setMesaj({ mesaj, stil: "bg-danger text-white" });
    } else if (tur === "basari") {
      setMesaj({ mesaj, stil: "bg-success text-white" });
    } else {
      setMesaj({ mesaj, stil: "bg-dark text-white" });
    }
  };

  useEffect(() => {
    if (sure && sure.kalan > 0) {
      const sureInterval = setInterval(() => {
        setSure({ ...sure, kalan: sure.kalan - 1 });
      }, 1000);

      return () => {
        clearInterval(sureInterval);
      };
    }
  });

  const oyunaBasla = () => {
    setSure({
      kalan: 240
    });
    setMesaj(null);
    setPuanToplam(0);
    setOyun({
      ...oyun,
      sorular: oyun.sorular.map(soru => {
        soru.soruldu = false;
        return soru;
      }),
      puanToplam: 0,
      puanHarf: 0,
      tamamlandi: false
    });
    soruSor();
  };

  const soruSor = () => {
    let sorular = oyun.sorular;
    let mevcutSoru = sorular.find(soru => !soru.soruldu);

    if (!mevcutSoru) {
      oyunBitti();
      return;
    }

    let harfler = [];
    mevcutSoru.cevap.split("").forEach(h => {
      harfler.push({
        deger: h,
        acik: false
      });
    });
    mevcutSoru.soruldu = true;
    let toplamHarfPuan = harfler.length * 100;
    setOyun({
      ...oyun,
      mevcutSoru,
      harfler,
      sorular,
      puanHarf: toplamHarfPuan,
      yarismaciCevap: "",
      tamamlandi: false
    });
  };

  const cevapla = () => {
    let toplam = puanToplam;
    if (
      oyun.yarismaciCevap.toLocaleUpperCase("tr") ===
      oyun.mevcutSoru.cevap.toLocaleUpperCase("tr")
    ) {
      toplam += oyun.puanHarf;
      mesajver("Tebrikler, doğru bildiniz!", "basari");
    } else {
      toplam -= oyun.puanHarf;
      mesajver(
        `Maalesef yanlış cevap. Doğru cevap: ${oyun.mevcutSoru.cevap}`,
        "hata"
      );
    }
    setPuanToplam(toplam);
    soruSor();
  };

  const oyunBitti = () => {
    setOyun({ ...oyun, tamamlandi: true, mevcutSoru: null, harfler: [] });
  };

  const harfVer = () => {
    if (oyun.puanHarf <= 100) {
      return;
    }
    let rastgeleHarfIndex = Math.floor(Math.random() * oyun.harfler.length);
    let harf = oyun.harfler[rastgeleHarfIndex];
    while (harf.acik) {
      rastgeleHarfIndex = Math.floor(Math.random() * oyun.harfler.length);
      harf = oyun.harfler[rastgeleHarfIndex];
    }
    setOyun({
      ...oyun,
      harfler: oyun.harfler.map((harf, index) => {
        if (index === rastgeleHarfIndex) {
          harf.acik = true;
        }
        return harf;
      }),
      puanHarf: oyun.puanHarf - 100
    });
  };

  const cevapDegisti = e => {
    setOyun({ ...oyun, yarismaciCevap: e.target.value });
  };

  return (
    <div className="container mt-4">
      {!oyun.mevcutSoru && (
        <div className="card mb-4">
          <div className="card-header">
            <h4 className="mb-0">Kelime Oyununa Hoşgeldiniz!</h4>
          </div>
          <div className="card-body">
            <p className="mb-0">
              Yarışmaya başlamak için başla butonuna tıklayabilirsiniz.
            </p>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" onClick={oyunaBasla}>
              Yarışmaya Başla
            </button>
          </div>
        </div>
      )}
      {oyun.tamamlandi && (
        <div className="card">
          <div className="card-body">
            Tebrikler oyunu {puanToplam} puan ile tamamladınız!
          </div>
        </div>
      )}
      {oyun.mevcutSoru && (
        <div className="card mb-4">
          <div className="card-header">
            <h4 className="mb-0">{oyun.mevcutSoru.soru}</h4>
          </div>
          <div className="card-body">
            <div className="harfler d-flex">
              {oyun.harfler.map((harf, index) => (
                <HarfView {...harf} key={"key-" + index} />
              ))}
            </div>
          </div>
          <div className="card-footer d-flex">
            <div className="mr-4">Toplam Puan: {puanToplam}</div>
            <div className="mr-4">Kelime Puanı: {oyun.puanHarf}</div>
            <div className="mr-4">Kalan Süre: {sure.kalan} saniye</div>
          </div>
          <div className="card-footer">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Cevabınız?"
                value={oyun.yarismaciCevap}
                onChange={cevapDegisti}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-success"
                  type="button"
                  onClick={cevapla}
                >
                  Cevapla
                </button>
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={harfVer}
                >
                  Harf Ver
                </button>
              </div>
            </div>
          </div>
          {mesaj && (
            <div className={"card-footer " + mesaj.stil}>{mesaj.mesaj}</div>
          )}
        </div>
      )}
    </div>
  );
};
