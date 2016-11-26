# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(2) do |config|

    config.vm.define "nodejs.api.db" do |machine|
      machine.vm.box = "centos/7"
      machine.vm.hostname = "nodejs.api.db.vagrant.local"
      machine.vm.network "private_network", ip: "192.168.50.10"

      machine.vm.provider "virtualbox" do |vb|
         vb.memory = "1024"
      end

      machine.vm.provision "shell", inline: <<-SHELL
        sudo su
        echo 'Adding `sudo su` to the `.bashrc` for `vagrant` user...'
        echo 'sudo su' >> /home/vagrant/.bashrc
        rpm -Uvh http://dev.mysql.com/get/mysql-community-release-el6-5.noarch.rpm
        yum -y install mysql-community-server-5.6.30
        chkconfig mysqld on
        service mysqld start
        mysql -e "CREATE USER 'local'@'localhost' IDENTIFIED BY 'local';"
        mysql -e "CREATE USER 'local'@'%' IDENTIFIED BY 'local';"
        mysql -e "create database nodejsApiDB;"
        mysql -e "GRANT ALL ON *.* TO 'local'@'localhost' IDENTIFIED BY 'local';"
        mysql -e "GRANT ALL ON *.* TO 'local'@'%' IDENTIFIED BY 'local';"
        mysql -e "FLUSH PRIVILEGES;"
        echo "Done.."
      SHELL

    end
end
