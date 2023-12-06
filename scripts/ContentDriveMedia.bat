@rem  Batch file to create a list of all files on a drive. 
@rem  The list is saved in the Google drive folder.

@ set drive="C:\Users\Windows\Mi unidad\Software\DiscosDuros\"

@echo off

for /f "tokens=1-5*" %%1 in ('vol') do (
   set vol=%%6 & goto done
)
:done
set vol=%vol:~0,-1%

chcp 65001 >nul 
rem dir . /s /b > %drive%%vol:~5%".txt"
dir %drive% /s /b /a-d *.mp3 *.mkv *.mp4 *.avi > %drive%%vol:~5%".txt"


@echo on
@echo List of files on %vol% saved in %drive%%vol:~5%".txt"
@pause














