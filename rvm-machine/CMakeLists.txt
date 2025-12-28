cmake_minimum_required(VERSION 3.10)
project(DaurCuanRVM)

set(CMAKE_CXX_STANDARD 17)

# Fetch FTXUI
include(FetchContent)
FetchContent_Declare(ftxui
  GIT_REPOSITORY https://github.com/ArthurSonzogni/FTXUI
  GIT_TAG v5.0.0
)
FetchContent_MakeAvailable(ftxui)

add_executable(rvm_app main.cpp)
target_link_libraries(rvm_app PRIVATE ftxui::screen ftxui::dom ftxui::component curl qrencode)