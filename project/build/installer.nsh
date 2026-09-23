; Nero kurulum özelleştirmeleri (electron-builder bu dosyayı otomatik ekler)
; Not: dosya UTF-8 BOM ile kaydedilir (Türkçe karakterler için).
;
; Veri güvenliği:
;   - Güncellemede notlar, yapılacaklar, ayarlar, istatistikler ve rozetler HER ZAMAN korunur.
;   - Sıfırlamak için kurulumdaki "Verilerin" sayfasında ayrı bir kutucuğu işaretlemek
;     ve ardından çıkan uyarıyı ayrıca onaylamak gerekir. Varsayılan hep "silme"dir.
;   - Sıfırlansa bile veriler silinmez, %APPDATA%\Nero-yedek klasörüne taşınır.
;   - Otomatik (sessiz) güncellemede hiçbir soru sorulmaz ve hiçbir şey silinmez.
;
; Nero verilerini her zaman %APPDATA%\Nero klasöründe tutar.

!include "LogicLib.nsh"
!include "nsDialogs.nsh"

; Karşılama ve bitiş sayfalarının renkleri
!ifndef MUI_BGCOLOR
  !define MUI_BGCOLOR "FAF3EA"
!endif
!ifndef MUI_TEXTCOLOR
  !define MUI_TEXTCOLOR "4A3A36"
!endif

!ifndef BUILD_UNINSTALLER
  Var NeroCleanInstall
  Var NeroHasData
  Var NeroDataCheckbox

  !macro customInit
    StrCpy $NeroCleanInstall "0"
    StrCpy $NeroHasData "0"
    SetShellVarContext current
    IfFileExists "$APPDATA\Nero\*.*" 0 +2
      StrCpy $NeroHasData "1"
    ${if} $installMode == "all"
      SetShellVarContext all
    ${endif}
  !macroend

  ; --- Karşılama sayfası -------------------------------------------------
  !macro customWelcomePage
    !define MUI_WELCOMEPAGE_TITLE "Nero'ya hoş geldin"
    !define MUI_WELCOMEPAGE_TEXT "Masaüstünde yaşayan, biraz huysuz ama seni seven küçük arkadaşın kuruluyor.$\r$\n$\r$\nDaha önce Nero kullandıysan notların, yapılacakların ve ayarların olduğu gibi korunur.$\r$\n$\r$\nDevam etmek için İleri'ye tıkla."
    !insertmacro MUI_PAGE_WELCOME
  !macroend

  ; --- Verilerin sayfası (sadece eski veri varsa görünür) -----------------
  !macro customPageAfterChangeDir
    Page custom NeroDataPage NeroDataLeave

    Function NeroDataPage
      StrCmp $NeroHasData "1" neroShowPage
        Abort
      neroShowPage:
      !insertmacro MUI_HEADER_TEXT "Verilerin" "Notların, yapılacakların ve ayarların güvende."
      nsDialogs::Create 1018
      Pop $0
      StrCmp $0 "error" 0 +2
        Abort

      ${NSD_CreateLabel} 0 0 100% 40u "Bilgisayarında Nero'nun kayıtlı verileri var: notlar, yapılacaklar, ayarlar, istatistikler ve rozetler.$\r$\n$\r$\nHepsi korunacak. Bir şey yapmana gerek yok, İleri'ye tıklayabilirsin."
      Pop $0

      ${NSD_CreateGroupBox} 0 52u 100% 70u "Sadece gerçekten sıfırdan başlamak istiyorsan"
      Pop $0

      ${NSD_CreateCheckbox} 10u 68u 92% 12u "Tüm verilerimi sil ve Nero'yu sıfırdan başlat"
      Pop $NeroDataCheckbox
      ${NSD_Uncheck} $NeroDataCheckbox

      ${NSD_CreateLabel} 22u 84u 88% 32u "İşaretlersen senden bir kez daha onay istenir. Veriler yine de kalıcı olarak silinmez, %APPDATA%\Nero-yedek klasörüne taşınır."
      Pop $0

      nsDialogs::Show
    FunctionEnd

    Function NeroDataLeave
      StrCpy $NeroCleanInstall "0"
      ${NSD_GetState} $NeroDataCheckbox $0
      ${If} $0 != ${BST_CHECKED}
        Return
      ${EndIf}
      MessageBox MB_YESNO|MB_ICONEXCLAMATION|MB_DEFBUTTON2 "Emin misin?$\r$\n$\r$\nTüm notların, yapılacakların, ayarların, istatistiklerin ve rozetlerin kaldırılacak. Nero seni ilk kez görüyormuş gibi başlayacak.$\r$\n$\r$\n(Eski veriler %APPDATA%\Nero-yedek klasörüne taşınır.)$\r$\n$\r$\nSıfırdan başlamak istiyor musun?" IDYES neroConfirmed
        ; Hayır: kutucuğu kaldır ve bu sayfada kal
        ${NSD_Uncheck} $NeroDataCheckbox
        Abort
      neroConfirmed:
        StrCpy $NeroCleanInstall "1"
    FunctionEnd
  !macroend

  ; --- Bitiş sayfası ---------------------------------------------------
  !macro customFinishPage
    Function NeroStartApp
      ${if} ${isUpdated}
        StrCpy $1 "--updated"
      ${else}
        StrCpy $1 ""
      ${endif}
      ${StdUtils.ExecShellAsUser} $0 "$launchLink" "open" "$1"
    FunctionEnd

    !define MUI_FINISHPAGE_TITLE "Nero hazır!"
    !define MUI_FINISHPAGE_TEXT "Kurulum tamamlandı. Nero masaüstünün bir köşesinde seni bekliyor.$\r$\n$\r$\nBüyük ihtimalle biraz huysuz. Geçer."
    !define MUI_FINISHPAGE_RUN
    !define MUI_FINISHPAGE_RUN_TEXT "Nero'yu şimdi başlat"
    !define MUI_FINISHPAGE_RUN_FUNCTION "NeroStartApp"
    !insertmacro MUI_PAGE_FINISH
  !macroend

  ; --- Kurulum ---------------------------------------------------------
  !macro customInstall
    ; Bu noktada electron-builder eski sürümü kaldırmış ve çalışan Nero'yu kapatmıştır.
    ; Sıfırlama seçilse bile veriler silinmez, yedek klasörüne taşınır.
    StrCmp $NeroCleanInstall "1" 0 neroInstallDone
      SetShellVarContext current
      DetailPrint "Sıfırlama: eski veriler Nero-yedek klasörüne taşınıyor..."
      RMDir /r "$APPDATA\Nero-yedek"
      Rename "$APPDATA\Nero" "$APPDATA\Nero-yedek"
      ${if} $installMode == "all"
        SetShellVarContext all
      ${endif}
    neroInstallDone:
  !macroend
!endif

; --- Kaldırma --------------------------------------------------------------
; Güncelleme sırasında hiçbir şey sorulmaz. Elle kaldırırken veriler varsayılan olarak korunur;
; silmek için iki ayrı soruya "Evet" demek gerekir.
!macro customUnInstall
  ${ifNot} ${isUpdated}
    IfSilent neroUnDone
    MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Nero kaldırılıyor. Notların, yapılacakların ve ayarların bilgisayarında saklanmaya devam edecek; tekrar kurarsan kaldığın yerden devam edersin.$\r$\n$\r$\nBunları da silmek ister misin?" IDNO neroUnDone
    MessageBox MB_YESNO|MB_ICONEXCLAMATION|MB_DEFBUTTON2 "Emin misin? Notların, yapılacakların, ayarların ve rozetlerin kalıcı olarak silinecek." IDNO neroUnDone
      SetShellVarContext current
      RMDir /r "$APPDATA\Nero"
      ${if} $installMode == "all"
        SetShellVarContext all
      ${endif}
    neroUnDone:
  ${endIf}
!macroend
