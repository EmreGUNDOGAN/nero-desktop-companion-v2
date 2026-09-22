!macro customInstall
  DetailPrint "Nero kuruluyor..."
!macroend

!macro customUnInstall
  MessageBox MB_YESNO|MB_ICONQUESTION "Nero kullanıcı verileri de silinsin mi?" IDNO keepData
  RMDir /r "$APPDATA\Nero"
  keepData:
!macroend
